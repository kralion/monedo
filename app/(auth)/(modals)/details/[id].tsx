import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { expensesIdentifiers } from "~/constants/ExpensesIdentifiers";
import { createClerkSupabaseClient } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";

export default function ExpenseDetails() {
  const {
    expense,
    getExpenseById,
    loading,
    sumOfAllOfExpenses,
    totalExpenses,
  } = useExpenseStore();
  const { getTotalBudget, totalBudget } = useBudgetStore();
  const params = useLocalSearchParams<{ id: string }>();
  const supabase = createClerkSupabaseClient();

  if (!expense) return <ActivityIndicator />;

  React.useEffect(() => {
    getTotalBudget();
    sumOfAllOfExpenses();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (params.id) {
        getExpenseById(Number(params.id));
        const channel = supabase.channel("realtime-expenses").on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "expenses",
          },
          () => {
            getExpenseById(Number(params.id));
          }
        );
        return () => {
          channel.unsubscribe();
        };
      }
    }, [params.id])
  );

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense?.categories?.value
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  const percentage = (totalExpenses / totalBudget) * 100;

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
                  S/ {expense?.amount?.toFixed(2)}
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
                    <Text>{expense?.categories?.label}</Text>
                  </Badge>
                </View>
              </View>
            </View>
            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-3">
              <Progress
                className=" web:w-[60%] "
                getValueLabel={(value) => `${value}%`}
                value={Number((percentage / 10).toFixed(2))}
              />
              <View className="flex flex-row justify-between items-center">
                <Text>0%</Text>
                <Text>100%</Text>
              </View>

              <Text className="text-muted-foreground text-sm text-center">
                Consumido{" "}
                <Text className="font-bold text-primary dark:text-primary">
                  {Number((percentage / 10).toFixed(2))}%
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
