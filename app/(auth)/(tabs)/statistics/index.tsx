import NoData2Svg from "@/assets/svgs/no-data.svg";
import Chart from "@/components/statistics/chart";
import { useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import { router, useFocusEffect } from "expo-router";

import {
  Download,
  LineChart,
  PieChartIcon,
  Ellipsis,
} from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Expense } from "~/components/expense";
import { ChartSkeleton } from "~/components/skeleton/chart";
import { PieSkeleton } from "~/components/skeleton/pie";
import PieChart from "~/components/statistics/pie-chart";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { IExpense } from "~/interfaces";
import { getDateRange } from "~/lib/rangeDate";
import { useCategoryStore } from "~/stores/category";
import { useExpenseStore } from "~/stores/expense";
import Dropdown from "~/components/drop-down";
const items = [
  {
    label: "Grafico de línea",
    key: "line",
    title: "Grafico de línea",
    icon: "chart.bar.fill",
    iconAndroid: "asset:line_chart",
    value: "line",
  },
  {
    label: "Grafico de pie",
    key: "pie",
    title: "Grafico de pie",
    icon: "pie.chart.fill",
    iconAndroid: "asset:pie_chart",
    value: "pie",
  },
  {
    label: "Exportar datos",
    key: "export",
    title: "Exportar datos",
    icon: "arrow.down.square.fill",
    iconAndroid: "asset:download",
    value: "export",
  },
];
export default function Statistics() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const { user } = useUser();
  const [chartType, setChartType] = useState<"pie" | "line">("pie");
  const { getExpensesByPeriodicity, loading } = useExpenseStore();
  const { categories, getCategories } = useCategoryStore();
  const [timelineQuery, setTimelineQuery] = useState(getDateRange("diario"));
  const queryFilters = [
    getDateRange("hoy"),
    getDateRange("diario"),
    getDateRange("semanal"),
    getDateRange("mensual"),
  ];
  useFocusEffect(
    React.useCallback(() => {
      getExpensesByPeriodicity(timelineQuery).then((data) =>
        setExpenses(data as IExpense[])
      );
    }, [timelineQuery])
  );

  function handleDropdownSelect(key: string) {
    if (key === "export") {
      router.push({
        pathname: "/(auth)/(tabs)/statistics/export-data",
        params: { periodicity: timelineQuery.value },
      });
    } else {
      setChartType(key as "pie" | "line");
    }
  }

  React.useEffect(() => {
    getCategories(user?.id as string);
  }, []);
  return (
    <SafeAreaView className="py-4 bg-white dark:bg-zinc-900">
      <View className="flex flex-col gap-8">
        <View className="flex flex-row  justify-between px-4 pt-7">
          <View className="flex flex-col ">
            <Text className="text-4xl font-bold ">Estadísticas</Text>
          </View>

          {/* <Dropdown items={items} onSelect={handleDropdownSelect} /> */}
        </View>
        <View className="flex flex-col gap-4">
          <FlatList
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
                <Text className="text-black dark:text-black">{item.label}</Text>
              </Button>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Separator className="text-muted-foreground" />
        </View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-white dark:bg-zinc-900"
      >
        <View className="flex flex-col gap-4 justify-center mt-4">
          {loading ? (
            <>{chartType === "pie" ? <PieSkeleton /> : <ChartSkeleton />}</>
          ) : (
            <>
              {chartType === "pie" ? (
                <View className="flex flex-col gap-2">
                  <PieChart timelineQuery={timelineQuery} data={expenses} />
                  <View style={styles.grid}>
                    {categories.map((item, index) => (
                      <View
                        key={index}
                        className="flex flex-row items-center gap-1"
                      >
                        <View
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <Text className="text-gray-700">{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View className="flex flex-col items-center gap-4 mt-4">
                  <Chart timelineQuery={timelineQuery} data={expenses} />
                  {timelineQuery.value === "mensual" && (
                    <Text className="text-muted-foreground text-sm">
                      Scrollable horizontalmente
                    </Text>
                  )}
                </View>
              )}
            </>
          )}

          <Text className="text-xl font-bold mx-4  mt-12">Top Gastos</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <LegendList
              recycleItems
              contentContainerStyle={{ paddingHorizontal: 16 }}
              contentContainerClassName="pb-[400px] px-4"
              data={expenses}
              renderItem={({ item: expense, index }) => (
                <View>
                  {index === 0 ? (
                    <>
                      <View className="h-[0.5px] bg-zinc-200 dark:bg-zinc-600 ml-[60px]" />
                      <Expense expense={expense} />
                    </>
                  ) : index === expenses.length - 1 ? (
                    <>
                      <Expense expense={expense} />
                      <View className="h-[0.5px] bg-zinc-200 dark:bg-zinc-600 ml-[60px]" />
                    </>
                  ) : (
                    <Expense expense={expense} />
                  )}
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-[0.5px] bg-zinc-200 dark:bg-zinc-600 ml-[60px] " />
              )}
              estimatedItemSize={320}
              ListEmptyComponent={
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
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    padding: 16,
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12, // Adjust as needed
  },
});
