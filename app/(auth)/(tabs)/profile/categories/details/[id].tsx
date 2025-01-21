import { Expense } from "@/components/expense";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { IExpense } from "~/interfaces";
import { useExpenseStore } from "~/stores/expense";

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();
  const { getExpensesByCategory } = useExpenseStore();
  const [expenses, setExpenses] = React.useState<IExpense[]>([]);

  React.useEffect(() => {
    getExpensesByCategory(Number(id)).then((data) => setExpenses(data));
  }, [id]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-background"
    >
      <View className="p-4">
        {expenses.length === 0 ? (
          <Text className="text-center text-muted-foreground">
            Sin gastos en esta categoría
          </Text>
        ) : (
          expenses.map((expense) => (
            <Expense key={expense.id} expense={expense} />
          ))
        )}
      </View>
    </ScrollView>
  );
}
