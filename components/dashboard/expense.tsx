import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense } from "@/interfaces";
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
export function Expense({ expense }: { expense: IExpense }) {
  const { categoria, monto, fecha } = expense;
  const formattedDate = fecha
    ? formatDate(new Date(fecha))
    : "No date provided";
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.categoria
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  return (
    <Pressable
      onPress={() => {
        router.push(`/(expenses)/details/${expense.id}`);
      }}
    >
      <Card className="w-full max-w-sm active:opacity-80 rounded-xl mb-12">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Image
              width={45}
              height={45}
              source={{
                uri: assetIndentificador,
              }}
            />
            {categoria}
          </CardTitle>
          <CardDescription className="flex flex-row items-center justify-between">
            <Text className="text-sm">{formattedDate}</Text>
            <View className="flex flex-row gap-2 items-center">
              <Text className="text-3xl font-bold text-red-500">
                - S/. {monto}
              </Text>
              <ChevronRight size={20} color="$gray8" />
            </View>
          </CardDescription>
        </CardHeader>
      </Card>
    </Pressable>
  );
}
