import NoData2Svg from "@/assets/svgs/no-data.svg";
import { Expense } from "~/components/expense";
import Chart from "@/components/statistics/chart";
import { useExpenseContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { parseISO } from "date-fns";
import { router } from "expo-router";
import { Download } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { IExpense } from "~/interfaces";
import { getDateRange } from "~/lib/rangeDate";

export default function Statistics() {
  const [topExpenses, setTopExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const { getTopExpenses } = useExpenseContext();
  const [timelineQuery, setTimelineQuery] = useState({
    value: "diario",
    label: "Diario",
    ...getDateRange("diario"),
  });
  const queryFilters = [
    {
      value: "hoy",
      label: "Hoy",
      ...getDateRange("hoy"),
    },
    {
      value: "diario",
      label: "Diario",
      ...getDateRange("diario"),
    },
    {
      value: "semanal",
      label: "Semanal",
      ...getDateRange("semanal"),
    },
    {
      value: "mensual",
      label: "Mensual",
      ...getDateRange("mensual"),
    },
  ];

  const fetchTopExpenses = async () => {
    setLoading(true);
    try {
      const expenses = await getTopExpenses({
        startTimeOfQuery: timelineQuery.startTimeOfQuery,
        endTimeOfQuery: timelineQuery.endTimeOfQuery,
      });
      if (!expenses) return;

      const processedExpenses = expenses.map((expense) => ({
        ...expense,
        parsedDate: parseISO(expense.date as string),
      }));

      setTopExpenses(processedExpenses);
    } catch (error) {
      console.error("Error in fetchTopExpenses:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTopExpenses();
  }, [timelineQuery]);
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
        <View className="flex flex-col gap-4">
          <FlashList
            data={queryFilters}
            renderItem={({ item }) => (
              <Button
                className="rounded-full ml-4 px-6"
                size="sm"
                variant={
                  timelineQuery.value === item.value ? "default" : "outline"
                }
                onPress={() => setTimelineQuery(item)}
              >
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
          {loading && <ActivityIndicator size="large" className="mt-5" />}
          {topExpenses.length === 0 && (
            <View className="flex flex-col items-center justify-center  ">
              <NoData2Svg width={150} height={150} />
              <View>
                <Text className="text-center text-xl text-muted-foreground">
                  Sin datos
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  Para este filtro no hay gastos registrados aún
                </Text>
              </View>
            </View>
          )}
          <FlashList
            //TODO: This expenses data should be dinamic and show the top expenses only maybe limit to 12 items
            contentContainerStyle={{ paddingHorizontal: 16 }}
            data={topExpenses}
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
