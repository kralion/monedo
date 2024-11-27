import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense } from "@/interfaces";
import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Image } from "react-native";
import { H4, ListItem, Text, XStack } from "tamagui";
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
    <ListItem
      onPress={() => {
        router.push(`/(expenses)/details/${expense.id}`);
      }}
      borderRadius="$5"
      pressStyle={{
        opacity: 0.8,
      }}
      mb={12}
      title={
        <Text fontSize="$6" fontWeight="700">
          {categoria}
        </Text>
      }
      icon={
        <Image
          width={45}
          height={45}
          source={{
            uri: assetIndentificador,
          }}
        />
      }
      subTitle={formattedDate}
      iconAfter={
        <XStack gap="$2" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$red10">
            - S/. {monto}
          </Text>
          <ChevronRight size={20} color="$gray8" />
        </XStack>
      }
    />
  );
}
