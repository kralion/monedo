import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { IExpense } from "~/interfaces";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function Expense({ expense }: { expense: IExpense }) {
  const { category, amount, date } = expense;
  const formattedDate = date ? formatDate(new Date(date)) : "No date provided";
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === category.value
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/(modals)/details/${expense.id}`);
        }}
        className="card active:opacity-80 flex flex-row gap-2   items-center"
      >
        <Image width={45} height={45} source={{ uri: assetIndentificador }} />
        <View className="flex flex-row justify-between items-center px-2 py-4 border-b border-zinc-200 w-[90%]">
          <View className="card-title flex flex-row items-center gap-2">
            <View className="card-title-details flex flex-col">
              <Text className="text-xl font-semibold">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  {category.label}
                </Animated.Text>
              </Text>
              <Text className="text-xs text-muted-foreground">
                {formattedDate}
              </Text>
            </View>
          </View>
          <View className="card-description flex flex-row items-center justify-between">
            <View className="card-description-amount flex flex-row gap-2 items-center">
              <Text className="text-xl text-red-500 font-semibold">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  S/. {amount}
                </Animated.Text>
              </Text>
              <Button variant="ghost" size="icon">
                <ChevronRight size={20} color="gray" />
              </Button>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
