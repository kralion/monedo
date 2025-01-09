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
  const { category, amount, description } = expense;
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === category.value
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
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
          className="bg-brand/20 rounded-full p-2"
          source={{ uri: assetIndentificador }}
        />
        <View className="flex flex-row justify-between items-center px-2 py-4  w-[90%]">
          <View className="card-title flex flex-row items-center gap-2">
            <View className="card-title-details flex flex-col">
              <Text className="text-xl font-semibold dark:text-white">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  {category.label}
                </Animated.Text>
              </Text>
              <Text className="text-sm text-muted-foreground">
                {description.length > 25
                  ? `${description.slice(0, 25)}...`
                  : description}
              </Text>
            </View>
          </View>
          <View className="card-description flex flex-row items-center justify-between">
            <View className="card-description-amount flex flex-row items-center">
              <Text className="text-xl text-red-500 font-semibold">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  - S/. {amount.toFixed(2)}
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
