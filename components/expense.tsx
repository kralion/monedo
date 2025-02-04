import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { IExpense } from "~/interfaces";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function Expense({ expense }: { expense: IExpense }) {
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense.categories?.label.toLowerCase()
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  const formattedDate = new Date(expense.date).toLocaleDateString("es-ES", {
    month: "short",
    day: "2-digit",
  });
  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/(auth)/(modals)/details/${expense.id}`);
        }}
        className="card active:opacity-80 flex flex-row gap-1   items-center"
      >
        <Image
          width={50}
          height={50}
          className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-2"
          source={{ uri: assetIndentificador }}
        />
        <View className="flex flex-row justify-between items-center px-2 py-4  w-[90%]">
          <View className="card-title flex flex-row items-center gap-2">
            <View className="card-title-details flex flex-col">
              <Text className="text-xl font-semibold dark:text-white">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  {expense.categories?.label}
                </Animated.Text>
              </Text>
              <Text className="text-sm text-muted-foreground">
                {expense.description.length > 25
                  ? `${expense.description.slice(0, 25)}...`
                  : expense.description}
              </Text>
            </View>
          </View>
          <View className="flex flex-col items-end gap-1 px-4">
            <Text className="text-2xl text-red-500 dark:text-red-400  font-semibold">
              <Animated.Text entering={FadeIn.duration(1500)}>
                - S/{expense.amount}
              </Animated.Text>
            </Text>
            <Text className="text-xs text-muted-foreground">
              {formattedDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
