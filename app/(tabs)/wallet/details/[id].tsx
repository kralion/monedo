import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
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
import { Text } from "~/components/ui/text";
import { useBudgetContext } from "~/context";

export default function BudgetDetails() {
  const { deleteBudget, budget, getBudgetById, loading } = useBudgetContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const handleDeleteBudget = async (id: string) => {
    deleteBudget(id);
    router.push("/(tabs)/wallet");
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (params.id) {
      getBudgetById(params.id);
    }
  }, [params.id]);

  if (!budget) return null;

  const createdDate = new Date(budget.created_At);
  const futureDate = new Date(createdDate);
  futureDate.setDate(createdDate.getDate() + 30);

  const formattedDate = futureDate.toLocaleDateString("es-PE", {
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {loading && (
        <View className="flex flex-col justify-center items-center min-h-full">
          <ActivityIndicator size="large" />
        </View>
      )}
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
              </View>
              <Separator className="text-muted-foreground" />
              <Text className="text-lg text-muted-foreground ">
                {budget.description}
              </Text>
            </View>

            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-2">
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Fecha Registro</Text>
                  <Text>
                    {new Date(budget.created_At).toLocaleDateString("es-PE", {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">
                    Fecha Expiración
                  </Text>
                  <Text>{formattedDate}</Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Hora</Text>
                  <Text>
                    {new Date(budget.created_At).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
