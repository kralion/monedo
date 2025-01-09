import { useBudgetContext, useExpenseContext } from "@/context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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
import { IBudget } from "~/interfaces";
import { createClerkSupabaseClient } from "~/lib/supabase";

export default function ExpenseDetails() {
  const {
    deleteExpense,
    expense,
    getExpenseById,
    loading,
    sumOfAllOfExpensesMonthly,
  } = useExpenseContext();
  const { getCurrentBudget } = useBudgetContext();
  const [budget, setBudget] = React.useState({} as IBudget);
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const supabase = createClerkSupabaseClient();
  const handleDeleteExpense = async (id: string) => {
    deleteExpense(id);
    router.push("/(auth)/(tabs)");
    setIsOpen(false);
  };
  async function calculateTotalMonthExpenses() {
    const total = await sumOfAllOfExpensesMonthly();
    setTotalMonthExpenses(total);
    return total;
  }

  useFocusEffect(
    React.useCallback(() => {
      if (params.id) {
        getExpenseById(params.id);
        const channel = supabase.channel("realtime-expenses").on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "expenses",
          },
          () => {
            getExpenseById(params.id);
          }
        );
        return () => {
          channel.unsubscribe();
        };
      }
    }, [params.id])
  );

  React.useEffect(() => {
    getCurrentBudget().then((budget) => {
      if (!budget) return;
      setBudget(budget);
    });
    calculateTotalMonthExpenses();
  }, []);

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense?.category?.value
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  const percentage = (totalMonthExpenses / budget.amount) * 100;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900"
    >
      <View className="flex flex-col gap-4 p-4">
        {loading ? (
          <ActivityIndicator size="large" className="mt-20" />
        ) : (
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
                <Text className="text-5xl tracking-tighter font-bold ">
                  S/. {expense.amount}
                </Text>
              </View>
              <Separator className="text-muted-foreground" />
              <Text className="text-lg dark:text-secondary  text-secondary-foreground">
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
                    <Text>{expense?.category?.label}</Text>
                  </Badge>
                </View>
              </View>
            </View>
            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-3">
              <Progress
                className=" web:w-[60%] "
                getValueLabel={(value) => `${value}%`}
                value={percentage / 10}
              />
              <View className="flex flex-row justify-between items-center">
                <Text>0%</Text>
                <Text>100%</Text>
              </View>

              <Text className="text-muted-foreground text-sm text-center">
                Consumido{" "}
                <Text className="font-bold text-primary">
                  {percentage / 10}%
                </Text>{" "}
                del presupuesto para el mes actual.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
