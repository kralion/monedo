import Chart from "@/components/statistics/chart";
import { Expense } from "@/components/statistics/expense";
import { useExpenseContext } from "@/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { FileLineChart } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { Animated, ScrollView, TouchableOpacity, View } from "react-native";
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
        <Animated.View style={{ opacity: fadeAnim }}>
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
              <FlashList
                data={expenses}
                renderItem={({ item }) => <Expense expense={item} />}
                estimatedItemSize={16}
              />
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <SafeAreaView className="py-4">
            <View className="flex flex-col gap-3 ">
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
                className="absolute z-10"
                data={queryFilters}
                renderItem={({ item }) => (
                  <Button className="rounded-full ml-2 mr-1 px-6" size="sm">
                    <Text>{item.label}</Text>
                  </Button>
                )}
                estimatedItemSize={16}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <Chart timelineQuery={timelineQuery} />
              <View className="flex flex-row items-center justify-between px-4">
                <Button
                  variant="ghost"
                  onPress={() => {
                    router.push("/(modals)/export-data");
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
            </View>
          </SafeAreaView>
          <ScrollView>
            <View className="flex flex-col pb-5">
              <FlashList
                data={expenses}
                renderItem={({ item: expense }) => {
                  return <Expense expense={expense} />;
                }}
                estimatedItemSize={100}
              />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}
