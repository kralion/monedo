import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense, IExpenseGET } from "@/interfaces";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export function Expense({ expense }: { expense: IExpenseGET }) {
  const { category, amount, date } = expense;
  const formattedDate = date ? formatDate(new Date(date)) : "No date provided";
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.category
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  return (
    <Card className=" active:opacity-80 rounded-xl mb-5">
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <CardTitle
          onPress={() => {
            router.push(`/(modals)/details/${expense.id}`);
          }}
        >
          <View className="flex flex-row items-center gap-2">
            <Image
              width={45}
              height={45}
              source={{
                uri: assetIndentificador,
              }}
            />
            <View className="flex flex-col ">
              <Text className="text-xl font-semibold">{category}</Text>

              <Text className="text-xs text-muted-foreground">
                {formattedDate}
              </Text>
            </View>
          </View>
        </CardTitle>
        <CardDescription className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-2 items-center">
            <Text className="text-xl font-bold text-red-500">
              - S/. {amount}
            </Text>
            <Button variant="ghost" size="icon">
              <ChevronRight size={20} color="gray" />
            </Button>
          </View>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
