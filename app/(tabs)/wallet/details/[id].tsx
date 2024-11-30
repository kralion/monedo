import { createClerkSupabaseClient } from "@/lib/supabase";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Image, ScrollView, View } from "react-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { useBudgetContext } from "~/context";
import { IBudget } from "~/interfaces";

export default function ExpenseDetails() {
  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClerkSupabaseClient();
  const { deleteBudget } = useBudgetContext();
  const [budget, setBudget] = React.useState({} as IBudget);
  const [isOpen, setIsOpen] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<{ id: string }>();
  const handleDeleteBudget = async (id: string) => {
    setIsLoading(true);
    deleteBudget(id);
    setIsLoading(false);
    // toast.show("Gasto eliminado");
    router.push("/(tabs)/wallet");
    setIsOpen(false);
  };

  async function getBudgetById(id: string) {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setBudget(data);
    setIsLoading(false);
    return data;
  }

  React.useEffect(() => {
    if (params.id) {
      getBudgetById(params.id);
    }
  }, [params.id]);

  if (!budget) return null;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-4 p-4">
        <AlertDialog open={isOpen}>
          <AlertDialogContent key="content">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar Presupuesto</AlertDialogTitle>
              <AlertDialogDescription>
                Este presupuesto será eliminado de la base de datos y no podrá
                ser recuperado.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onPress={() => setIsOpen(false)} asChild>
                <Button variant="ghost">
                  <Text>Cancelar</Text>
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onPress={() => handleDeleteBudget(params.id ?? "")}>
                  <Text>Eliminar</Text>
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ScrollView>
          {isLoading && (
            <View className="flex flex-col justify-center items-center min-h-full">
              <ActivityIndicator size="large" />
              <Text className="text-muted-foreground">Cargando...</Text>
            </View>
          )}
          <View className="flex flex-col gap-8">
            <View className="flex flex-col gap-4">
              <Image
                width={100}
                height={100}
                source={{
                  uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
                }}
              />
              <View className="flex flex-col">
                <Text className="text-5xl tracking-tighter font-bold">
                  S/. {budget.amount}
                </Text>
                <Text className="text-lg text-muted-foreground ">
                  {budget.description}
                </Text>
              </View>
            </View>

            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-2">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Fecha Registro</Text>
                  <Text className="font-bold">
                    {new Date(budget.created_At).toLocaleDateString("es-PE", {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Hora</Text>
                  <Text className="font-bold">
                    {new Date(budget.created_At).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            </View>
            <Separator className="text-muted-foreground" />

            <Button
              onPress={() => setIsOpen(true)}
              size="lg"
              variant="destructive"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Eliminar</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
