import { Expense } from "@/components/expense";
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IExpense } from "~/interfaces";
import { useExpenseStore } from "~/stores/expense";

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
    <ScrollView
      className="web:md:w-1/2 web:md:mx-auto"
      contentInsetAdjustmentBehavior="automatic"
    >
      <LegendList
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: 20,
        }}
        data={expenses}
        estimatedItemSize={320}
        ItemSeparatorComponent={() => (
          <View className="h-[0.75px] bg-zinc-200 dark:bg-zinc-700 ml-[60px]" />
        )}
        renderItem={({ item: expense, index }) => <Expense expense={expense} />}
        recycleItems
      />
    </ScrollView>
  );
}
