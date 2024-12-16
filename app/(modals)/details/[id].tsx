import { useExpenseContext } from "@/context";
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
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { ActivityIndicator } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";
import { expensesIdentifiers } from "~/constants/ExpensesIdentifiers";

export default function ExpenseDetails() {
  const { deleteExpense, expense, getExpenseById, loading } =
    useExpenseContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const handleDeleteExpense = async (id: string) => {
    deleteExpense(id);
    router.push("/(tabs)");
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (params.id) {
      getExpenseById(params.id);
    }
  }, [params.id]);

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.category
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  //TODO: Cambiar este valor por el monto presupuestado del mes actual
  const monto_presupuestado = 1000;
  const totalPercentageExpensed =
    (expense.amount ?? 100 / monto_presupuestado) * 100;
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-4 p-4">
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
                <Button variant="ghost">
                  <Text>Cancelar</Text>
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onPress={() => handleDeleteExpense(params.id ?? "")}>
                  <Text>Eliminar</Text>
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ScrollView>
          {loading && (
            <View className="flex flex-col justify-center items-center min-h-full">
              <ActivityIndicator size="large" />
            </View>
          )}

          <View className="flex flex-col gap-8">
            <View className="flex flex-col gap-4">
              <Image
                width={100}
                height={100}
                source={{
                  uri: assetIndentificador,
                }}
              />
              <View className="flex flex-col">
                <Text className="text-5xl tracking-tighter font-bold">
                  S/. {expense.amount}
                </Text>
              </View>
              <Separator className="text-muted-foreground" />
              <Text className="text-lg text-muted-foreground ">
                {expense.description}
              </Text>
            </View>

            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-2">
              <View className="flex flex-col gap-3">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Fecha</Text>
                  <Text>
                    {new Date(expense.date).toLocaleDateString("es-PE", {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Hora</Text>
                  <Text>
                    {new Date(expense.date).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Categoria</Text>
                  <Badge className="py-1 px-2" variant="outline">
                    <Text>{expense.category}</Text>
                  </Badge>
                </View>
              </View>
            </View>
            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-3">
              {/* //TODO: Cambiar este valor por el monto porcentual del mes actual */}
              <Progress className=" web:w-[60%] " value={70} max={100} />

              <View className="flex flex-row justify-between items-center">
                <Text>0</Text>
                {/* //TODO: Cambiar este valor por el monto presupuestado del mes actual */}
                <Text>1000</Text>
              </View>

              <Text className="text-muted-foreground text-sm text-center">
                Consumido <Text className="font-bold text-primary"> 67%</Text>{" "}
                del presupuesto para el mes actual.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
