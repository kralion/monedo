import NoData2Svg from "@/assets/svgs/no-data.svg";
import Chart from "@/components/statistics/chart";
import { useExpenseContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Download } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Expense } from "~/components/expense";
import { ChartSkeleton } from "~/components/skeleton/chart";
import { ExpenseSkeleton } from "~/components/skeleton/expense";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
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
  React.useEffect(() => {
    getExpensesByPeriodicity(timelineQuery).then((data) =>
      setExpenses(data as IExpense[])
    );
  }, [timelineQuery]);
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
                pathname: "/(tabs)/statistics/export-data",
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
        <View className="flex flex-col gap-4 justify-center mt-10">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Chart timelineQuery={timelineQuery} data={expenses} />
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
              renderItem={({ item: expense }) => {
                return <Expense expense={expense} />;
              }}
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
