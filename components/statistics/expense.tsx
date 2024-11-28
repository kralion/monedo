import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense } from "@/interfaces";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { Image, View } from "react-native";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
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
    <Card className="mb-6 rounded-2xl active:opacity-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle
          className="flex flex-row gap-1 items-center"
          onPress={() => {
            console.log("Expense clicked", expense.monto);
            router.push(`/(expenses)/details/${expense.id}`);
          }}
        >
          <Image
            width={45}
            height={45}
            source={{
              uri: assetIndentificador,
            }}
          />
          <View className="flex flex-col gap-1">
            <Text className="text-xl font-semibold">{categoria}</Text>
            <Text className="text-xs text-foreground/70">{formattedDate}</Text>
          </View>
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 items-center">
          <Text className="text-3xl font-bold text-destructive">
            - S/. {monto}
          </Text>
          <ChevronRight size={20} className="text-foreground/70" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
