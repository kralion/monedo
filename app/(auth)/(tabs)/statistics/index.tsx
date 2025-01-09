import NoData2Svg from "@/assets/svgs/no-data.svg";
import Chart from "@/components/statistics/chart";
import { useExpenseContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { router, useFocusEffect } from "expo-router";
import { Download } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Expense } from "~/components/expense";
import { ChartSkeleton } from "~/components/skeleton/chart";
import { ExpenseSkeleton } from "~/components/skeleton/expense";
import { PieSkeleton } from "~/components/skeleton/pie";
import PieChart from "~/components/statistics/pie-chart";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { legendItems } from "~/helpers/getCategoryColor";
import { IExpense } from "~/interfaces";
import { getDateRange } from "~/lib/rangeDate";
export default function Statistics() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const { getExpensesByPeriodicity, loading } = useExpenseContext();
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

  return (
    <SafeAreaView className="py-4">
      <View className="flex flex-col gap-8">
        <View className="flex flex-row  justify-between px-4 pt-7">
          <View className="flex flex-col ">
            <Text className="text-4xl font-bold ">Estadísticas</Text>
            <Text className="text-muted-foreground opacity-80">
              Tus analíticas de los gastos registrados
            </Text>
          </View>
          <Button
            onPress={() => {
              router.push({
                pathname: "/(auth)/(tabs)/statistics/export-data",
                params: { periodicity: timelineQuery.value },
              });
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
        <View className="flex flex-col gap-4 justify-center mt-4">
          {loading ? (
            <PieSkeleton />
          ) : (
            <View className="flex flex-col gap-2">
              <PieChart timelineQuery={timelineQuery} data={expenses} />
              <View style={styles.grid}>
                {legendItems.map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center gap-2"
                  >
                    <View
                      className="w-4 h-4 rounded-full "
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className=" text-gray-700">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <View className="flex flex-col items-center gap-4 mt-4">
              <Chart timelineQuery={timelineQuery} data={expenses} />
              <Text className="text-muted-foreground text-sm">
                Puedes deslizar a la izquiera si la vista incompleta.
              </Text>
            </View>
          )}

          <Text className="text-xl font-bold mx-4  mt-12">Top Gastos</Text>
          {loading ? (
            <View className="flex flex-col gap-2">
              <ExpenseSkeleton />
              <ExpenseSkeleton />
              <ExpenseSkeleton />
            </View>
          ) : (
            <FlashList
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
              estimatedItemSize={100}
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
    justifyContent: "space-between",
    gap: 5, // Adjust as needed
  },
  gridItem: {
    width: "30%", // Adjust for three columns
    margin: 5, // Adjust gap between rows
  },
});
