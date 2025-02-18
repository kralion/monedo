import { useUser } from "@clerk/clerk-expo";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { expensesIdentifiers } from "~/constants/ExpensesIdentifiers";
import { supabase } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";

export default function ExpenseDetails() {
  const { user } = useUser();
  const {
    expense,
    getExpenseById,
    loading,
    sumOfAllOfExpenses,
    totalExpenses,
    deleteExpense,
  } = useExpenseStore();
  const { getTotalBudget, totalBudget } = useBudgetStore();
  const params = useLocalSearchParams<{ id: string }>();

  React.useEffect(() => {
    getTotalBudget(user?.id as string);
    sumOfAllOfExpenses(user?.id as string);
  }, []);
  const handleDeleteExpense = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará el gasto seleccionado y no se puede deshacer",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => deleteExpense(expense?.id as number),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
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
    }, [params.id])
  );

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense?.categories?.label.toLowerCase()
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  const percentage = (totalExpenses / totalBudget) * 100;
  if (!expense) return <ActivityIndicator />;
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900 web:md:w-1/2 mx-auto web:md:pt-16"
    >
      <View className="flex flex-col gap-4 p-4">
        {loading ? (
          <ActivityIndicator size="large" className="mt-20" />
        ) : (
          <View className="flex flex-col gap-8">
            <Animated.View
              className="flex flex-col gap-4 items-center"
              entering={FadeInDown.duration(300).delay(200)}
            >
              <Image
                width={150}
                height={150}
                className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-8"
                source={{
                  uri: assetIndentificador,
                }}
              />
              <View className="flex flex-col">
                <Text className="text-5xl tracking-tighter font-bold ">
                  S/ {expense?.amount}
                </Text>
              </View>
              <Text className="text-lg dark:text-secondary  text-secondary-foreground">
                {expense.description}
              </Text>
            </Animated.View>
            <View className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <View className="flex flex-col gap-3 ">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Fecha</Text>
                  <Text>
                    {new Date(expense.date).toLocaleDateString("es-PE", {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <Separator />
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
                <Separator />

                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Categoria</Text>
                  <Badge className="py-1 px-2" variant="outline">
                    <Text>{expense?.categories?.label}</Text>
                  </Badge>
                </View>
                <Separator />
              </View>
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
            <View className="flex flex-col gap-4">
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/(modals)/add-expense",
                    params: { id: expense.id },
                  })
                }
                size="lg"
              >
                <Text>Editar</Text>
              </Button>
              <Button
                onPress={handleDeleteExpense}
                variant="destructive"
                size="lg"
              >
                <Text>Eliminar </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
