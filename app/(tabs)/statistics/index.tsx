import { Expense } from "@/components/shared/expense";
import Chart from "@/components/statistics/chart";
import { useExpenseContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Download } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

const items = [
  { name: "Top Gastos" },
  { name: "Periódicos" },
  { name: "Recientes" },
];

export default function Statistics() {
  const [queryType, setQueryType] = useState("recientes");
  const [timelineQuery, setTimelineQuery] = useState("semanal");
  const {
    getTopExpenses,
    getRecentExpenses,
    getExpensesByPeriodicity,
    expenses,
  } = useExpenseContext();
  const [showAll, setShowAll] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const fetchRecentExpenses = async () => {
    await getRecentExpenses();
  };
  const fetchTopExpenses = async () => {
    await getTopExpenses();
  };
  const fetchExpensesByPeriodicity = async () => {
    await getExpensesByPeriodicity();
  };
  React.useEffect(() => {
    if (queryType === "recientes") {
      fetchRecentExpenses();
    } else if (queryType === "top-gastos") {
      fetchTopExpenses();
    } else if (queryType === "periódicos") {
      fetchExpensesByPeriodicity();
    }
  }, [queryType]);
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showAll ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAll]);

  const queryFilters = [
    { value: "diario", label: "Diario" },
    { value: "semanal", label: "Semanal" },
    { value: "mensual", label: "Mensual" },
    { value: "hoy", label: "Hoy" },
  ];

  return (
    <SafeAreaView className="py-4">
      <View className="flex flex-col gap-8">
        <View className="flex flex-row  justify-between px-4">
          <View className="flex flex-col ">
            <Text className="text-4xl font-bold ">Estadísticas</Text>
            <Text className="text-muted-foreground opacity-80">
              Tus analíticas de los gastos registrados
            </Text>
          </View>
          <Button
            onPress={() => {
              router.push("/(tabs)/statistics/export-data");
            }}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Download color="#27BE8B" size={20} />
          </Button>
        </View>
        <View className="flex flex-col gap-5">
          <FlashList
            data={queryFilters}
            renderItem={({ item }) => (
              <Button className="rounded-full ml-4 px-6" size="sm">
                <Text>{item.label}</Text>
              </Button>
            )}
            estimatedItemSize={16}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Separator className="text-muted-foreground" />
        </View>
      </View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="flex flex-col gap-4 justify-center mt-10 min-h-screen-safe">
          <Chart timelineQuery={timelineQuery} />
          <Text className="text-xl font-bold mx-4  mt-12">Top Gastos</Text>
          <FlashList
            //TODO: This expenses data should be dinamic and show the top expenses only maybe limit to 12 items
            contentContainerStyle={{ paddingHorizontal: 16 }}
            data={expenses}
            renderItem={({ item: expense }) => {
              return <Expense expense={expense} />;
            }}
            estimatedItemSize={100}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
