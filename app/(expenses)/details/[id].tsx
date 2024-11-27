import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader, Loader2 } from "lucide-react-native";
import * as React from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

export default function ExpenseDetails() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { deleteExpense } = useExpenseContext();
  const [expense, setExpense] = React.useState({} as IExpense);
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const handleDeleteExpense = async (id: string) => {
    setIsLoading(true);
    deleteExpense(id);
    setIsLoading(false);
    // toast.show("Gasto eliminado");
    router.push("/(tabs)/home");
    setIsOpen(false);
  };

  async function getExpenseById(id: string) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setExpense(data);
    return data;
  }

  React.useEffect(() => {
    if (params.id) {
      getExpenseById(params.id);
    }
  }, [params.id]);

  const monto_gastado = expense.monto;
  //TODO: Cambiar este valor por el monto presupuestado del mes actual
  const monto_presupuestado = 1000;
  const totalPercentageExpensed =
    (monto_gastado ?? 100 / monto_presupuestado) * 100;
  return (
    <ScrollView>
      {expense.monto ? (
        <View className="flex flex-col gap-4">
          <AlertDialog open={isOpen}>
            <AlertDialogContent key="content">
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Gasto</AlertDialogTitle>
                <AlertDialogDescription>
                  Este gasto será eliminado de la base de datos y no podrá ser
                  recuperado.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onPress={() => setIsOpen(false)} asChild>
                  <Button variant="ghost">Cancelar</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onPress={() => handleDeleteExpense(params.id ?? "")}
                    variant="destructive"
                  >
                    Eliminar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <View className="flex flex-col gap-4">
            <Text className="text-muted-foreground">Monto</Text>
            <Text className="text-4xl">S/. {expense.monto.toFixed(2)}</Text>
            <Text className="text-muted-foreground mt-2">
              {expense.descripcion}
            </Text>
          </View>

          <Separator className="text-muted-foreground" />
          <View className="flex flex-col gap-3 p-4">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xl text-muted-foreground">Fecha</Text>
              <Text className="text-2xl">
                {new Date(expense.fecha).toLocaleDateString("es-PE", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xl text-muted-foreground">Hora</Text>
              <Text className="text-2xl">
                {new Date(expense.fecha).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xl text-muted-foreground">Categoria</Text>
              <Button disabled size="lg" variant="outline">
                {expense.categoria}
              </Button>
            </View>
            <Progress
              className="m-4 web:w-[60%]"
              value={totalPercentageExpensed}
              max={100}
            />

            <View className="flex flex-row mx-4 justify-between items-center">
              <Text className="text-2xl text-primary">0</Text>
              <Text className="text-2xl text-primary">1000</Text>
            </View>

            <Button
              onPress={() => setIsOpen(true)}
              size="lg"
              className="m-3 mt-5"
              variant="destructive"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                "Eliminar"
              )}
            </Button>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
          </View>
        </View>
      ) : (
        <View className="flex flex-1 justify-center items-center min-h-full">
          <Loader2 size={24} />
          <Text className="text-muted-foreground">Cargando...</Text>
        </View>
      )}
    </ScrollView>
  );
}
