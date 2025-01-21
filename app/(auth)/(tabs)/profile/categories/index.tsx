import { ICategory, IExpense } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import { router, useFocusEffect } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import * as React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useExpenseStore } from "~/stores/expense";

export default function Categories() {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const { user } = useUser();
  const { expenses } = useExpenseStore();
  const supabase = createClerkSupabaseClient();
  async function getCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user?.id);
    setCategories(data as ICategory[]);
    return data;
  }
  React.useEffect(() => {
    getCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const channel = supabase.channel("realtime-categories").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          getCategories();
        }
      );

      channel.subscribe();

      return () => {
        channel.unsubscribe();
      };
    }, [])
  );

  const renderItem = ({ item }: { item: ICategory }) => {
    const categoryExpenses = expenses.filter(
      (expense: IExpense) => expense.categories?.label === item.label
    ).length;

    return (
      <Animated.View entering={FadeInDown.duration(200).damping(10)}>
        <TouchableOpacity
          onPress={() =>
            router.push(`/(auth)/(tabs)/profile/categories/details/${item.id}`)
          }
          className="flex-row items-center justify-between p-4 mb-2 rounded-lg border border-border dark:border-zinc-800 bg-card dark:bg-zinc-700"
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: item.color }}
            />
            <View>
              <Text className="text-lg font-medium">{item.label}</Text>
              <Text className="text-sm text-muted-foreground">
                {item.color}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text>
              {categoryExpenses} {categoryExpenses > 1 ? "Gastos" : "Gasto"}
            </Text>
            <Button variant="ghost" size="icon">
              <ChevronRight size={20} color="gray" />
            </Button>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="bg-white dark:bg-zinc-900"
    >
      <LegendList
        recycleItems
        data={categories}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 80,
        }}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        estimatedItemSize={80}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </ScrollView>
  );
}
