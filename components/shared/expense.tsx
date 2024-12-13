import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import { router } from "expo-router";
import { IExpense } from "~/interfaces";

export function Expense({ expense }: { expense: IExpense }) {
  const { category, amount, date } = expense;
  const formattedDate = date ? formatDate(new Date(date)) : "No date provided";
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.category
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push(`/(modals)/details/${expense.id}`);
        }}
        className="card active:opacity-80"
      >
        <View className="card-header flex flex-row justify-between items-center px-2 py-4">
          <View className="card-title flex flex-row items-center gap-2">
            <Image
              width={45}
              height={45}
              source={{ uri: assetIndentificador }}
            />
            <View className="card-title-details flex flex-col">
              <Text className="text-xl font-semibold">{category}</Text>
              <Text className="text-xs text-muted-foreground">
                {formattedDate}
              </Text>
            </View>
          </View>
          <View className="card-description flex flex-row items-center justify-between">
            <View className="card-description-amount flex flex-row gap-2 items-center">
              <Text className="text-xl text-red-500">
                - S/. {amount.toFixed(2)}
              </Text>
              <Button variant="ghost" size="icon">
                <ChevronRight size={20} color="gray" />
              </Button>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Separator />
    </>
  );
}
