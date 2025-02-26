import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { formatDate } from "~/helpers/dateFormatter";
import { IExpense } from "~/interfaces";
import { Text } from "./ui/text";
import { ChevronRight } from "lucide-react-native";

export function Expense({ expense }: { expense: IExpense }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 1024;
  const isMobile = width < 768;
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense.categories?.label.toLowerCase()
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/(auth)/(modals)/details/${expense.id}`);
        }}
        className="card active:opacity-80 flex flex-row gap-1 items-center web:md:hover:bg-zinc-50 web:md:dark:hover:bg-zinc-800 web:md:transition-colors web:md:duration-200"
      >
        <Image
          style={{
            width: 50,
            height: 50,
          }}
          className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-2 web:md:w-14 web:md:h-14"
          source={{ uri: assetIndentificador }}
        />
        <View className="flex flex-row justify-between items-center px-2 py-4 w-[90%] web:md:w-[92%]">
          <View className="card-title flex flex-row items-center gap-2">
            <View className="card-title-details flex flex-col">
              <Text className="text-xl font-semibold dark:text-white">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  {expense.categories?.label}
                </Animated.Text>
              </Text>
              <Text className="text-sm text-muted-foreground web:md:text-base">
                {expense.description.length > 25
                  ? `${expense.description.slice(0, 25)}...`
                  : expense.description}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center mr-4 gap-4">
            <View className="flex flex-col items-end gap-1">
              <Text className="text-2xl text-red-500 dark:text-red-400 font-semibold ">
                <Animated.Text entering={FadeIn.duration(1500)}>
                  - S/{expense.amount}
                </Animated.Text>
              </Text>
              <Text className="text-xs text-muted-foreground web:md:text-sm">
                {formatDate(expense?.date as Date)}
              </Text>
            </View>
            <ChevronRight size={20} color="gray" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
