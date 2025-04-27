import { ICategory, IExpense } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronRight, Tag } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useCategoryStore } from "~/stores/category";
import { useExpenseStore } from "~/stores/expense";

export default function Categories() {
  const { user } = useUser();
  const { expenses } = useExpenseStore();
  const { categories, getCategories, loading } = useCategoryStore();

  React.useEffect(() => {
    (async () => {
      await getCategories(user?.id as string);
    })();
  }, []);

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

          className="flex-row items-center justify-between p-4 mb-2  border border-border dark:border-zinc-800 bg-card dark:bg-zinc-700"
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              <Tag size={20} color="white" />
            </View>
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
  if (!categories) return <ActivityIndicator className="mt-10" />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
    >
      <View className="flex flex-col p-4 gap-2">
        <Text className="text-3xl font-bold text-black dark:text-white ">
          Creadas
        </Text>
        <Text className=" text-muted-foreground ">
          Crea tus propias categorías para organizar tus gastos intuitivamente.
        </Text>
      </View>
      <View className="flex-1">
        <FlashList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentInsetAdjustmentBehavior="automatic"
        />
      </View>
    </ScrollView>
  );
}
