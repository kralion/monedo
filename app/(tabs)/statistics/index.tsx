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
import { Button as NativeButton } from "react-native";
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
    <SafeAreaView className="p-4">
      <View className="flex flex-col gap-4 mb-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-4xl font-bold">Estadísticas</Text>
          <NativeButton
            title="Exportar"
            color="black"
            onPress={() => {
              router.push("/(tabs)/statistics/export-data");
            }}
          />
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
        {/* <View className="flex flex-row items-center justify-between my-4">
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
                  <SelectTrigger className="px-4 gap-4">
                    <SelectValue placeholder="Recientes" />
                  </SelectTrigger>

                  <SelectContent className="w-1/2 ">
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
            </View> */}
        <View className="h-screen-safe-offset-0 flex flex-col gap-7 justify-center mt-10">
          <Chart timelineQuery={timelineQuery} />
          <Text className="text-xl font-bold">Historial de Gastos</Text>

          <FlashList
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
