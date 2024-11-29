import Chart from "@/components/statistics/chart";
import NoDataSvg from "@/assets/svgs/no-data.svg";
import { Expense } from "@/components/statistics/expense";
import { useExpenseContext } from "@/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { FileLineChart, Inbox } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
    <>
      {showAll ? (
        <Animated.View style={{ opacity: 80 }}>
          <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View className="flex flex-row justify-between">
              <Text>
                {queryType === "recientes"
                  ? "Recientes"
                  : queryType === "top-gastos"
                  ? "Top Gastos"
                  : "Periódicos"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAll(false);
                }}
              >
                <MaterialCommunityIcons name="arrow-collapse" size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <React.Suspense
                fallback={
                  <ActivityIndicator size="large" className="mx-auto mt-5" />
                }
              >
                {expenses && expenses.length > 0 ? (
                  <FlashList
                    data={expenses}
                    renderItem={({ item }) => <Expense expense={item} />}
                    estimatedItemSize={16}
                  />
                ) : (
                  <View className="flex flex-col items-center justify-center gap-5 h-screen-safe">
                    <NoDataSvg width={250} height={250} />
                    <View>
                      <Text className="text-center text-xl text-muted-foreground">
                        No tienes gastos aún
                      </Text>
                      <Text className="text-center text-sm text-muted-foreground">
                        Añade un gasto haciendo tap en el botón "+"
                      </Text>
                    </View>
                  </View>
                )}
              </React.Suspense>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <SafeAreaView className="py-4">
          <View className="flex flex-col gap-4 mb-2">
            <View className="flex flex-row items-center justify-between px-4">
              <Text className="text-4xl font-bold">Estadísticas</Text>
              <Text
                onPress={() => {
                  setShowAll(true);
                }}
                className="active:opacity-80"
              >
                Ver Todo
              </Text>
            </View>

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
          </View>
          <ScrollView>
            <View className="flex flex-row items-center justify-between p-4 mt-4">
              <Button
                variant="outline"
                onPress={() => {
                  router.push("/(tabs)/statistics/export-data");
                }}
              >
                <FileLineChart size={20} />
              </Button>
              <View className="flex flex-col">
                <Select>
                  <SelectTrigger className="px-4">
                    <SelectValue placeholder="Recientes" />
                  </SelectTrigger>

                  <SelectContent className="w-[95%]">
                    <SelectGroup>
                      {React.useMemo(
                        () =>
                          items.map((item, i) => {
                            return (
                              <SelectItem
                                label={item.name}
                                key={item.name}
                                value={item.name.toLowerCase()}
                              >
                                <Text>{item.name}</Text>
                              </SelectItem>
                            );
                          }),
                        [items]
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>
            </View>
            <View className="h-screen-safe-offset-0 flex flex-col justify-center">
              <Chart timelineQuery={timelineQuery} />
              <React.Suspense
                fallback={
                  <ActivityIndicator size="large" className="mx-auto mt-5" />
                }
              >
                {expenses && expenses.length > 0 ? (
                  <FlashList
                    data={expenses}
                    renderItem={({ item: expense }) => {
                      return <Expense expense={expense} />;
                    }}
                    estimatedItemSize={100}
                  />
                ) : null}
              </React.Suspense>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}
