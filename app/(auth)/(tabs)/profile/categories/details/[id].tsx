import { Expense } from "@/components/expense";
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IExpense } from "~/interfaces";
import { useExpenseStore } from "~/stores/expense";
import NoData2Svg from "@/assets/svgs/no-data.svg";

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();
  const { getExpensesByCategory, loading } = useExpenseStore();
  const [expenses, setExpenses] = React.useState<IExpense[]>([]);

  React.useEffect(() => {
    getExpensesByCategory(Number(id)).then((data) => setExpenses(data));
  }, [id]);

  if (!expenses || loading)
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <LegendList
      data={expenses}
      renderItem={({ item: expense }) => (
        <Expense key={expense.id} expense={expense} />
      )}
      estimatedItemSize={320}
      ListEmptyComponent={() => (
        <View className="flex flex-col items-center justify-center  ">
          <NoData2Svg width={150} height={150} />
          <View>
            <Text className="text-center text-xl text-muted-foreground">
              Sin gastos en esta categoría
            </Text>
            <Text className="text-center text-sm text-muted-foreground">
              Para este filtro no hay gastos registrados aún
            </Text>
          </View>
        </View>
      )}
      recycleItems
    />
  );
}
