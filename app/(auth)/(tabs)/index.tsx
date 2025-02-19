import NoData2Svg from "@/assets/svgs/no-data.svg";
import Card from "@/components/dashboard/card";
import { useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { ChevronUp, Crown } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Expense } from "~/components/expense";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { groupExpensesByDate } from "~/helpers/groupExpenseByDate";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useExpenseStore } from "~/stores/expense";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const { isPremium } = useUserPlan();
  const [showAll, setShowAll] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { getRecentExpenses, expenses } = useExpenseStore();
  React.useEffect(() => {
    setLoading(true);
    getRecentExpenses(user?.id as string);
    setLoading(false);
  }, []);
  const groupedExpenses = groupExpensesByDate(expenses);

  if (!expenses) {
    return <ActivityIndicator />;
  }
  if (!user) {
    <Redirect href="/(public)/sign-in" />;
    return;
  }

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler.value > 2 ? withTiming(1) : withTiming(0),
    };
  });
  function scrollToTop() {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  if (!isSignedIn) {
    router.replace("/(public)/sign-in");
  }

  return (
    <View>
      {showAll ? (
        <ScrollView contentContainerClassName="pb-64">
          <Animated.View style={{ opacity: 60 }}>
            <View className="web:md:w-1/2">
              <View className="flex flex-col gap-4">
                <View className="flex flex-row  justify-end items-end px-4 ">
                  <Text
                    onPress={() => {
                      setShowAll(false);
                    }}
                    className="text-muted-foreground px-1.5 opacity-50 "
                  >
                    Ver Menos
                  </Text>
                </View>

                {Object.keys(groupedExpenses).map((dateLabel) => (
                  <View key={dateLabel}>
                    <Text className="text-lg  px-4 text-muted-foreground">
                      {dateLabel}
                    </Text>
                    <LegendList
                      contentContainerStyle={{
                        paddingBottom: 50,
                        paddingHorizontal: 20,
                      }}
                      data={groupedExpenses[dateLabel]}
                      estimatedItemSize={320}
                      ItemSeparatorComponent={() => (
                        <View className="h-[0.75px] bg-zinc-200 dark:bg-zinc-700 ml-[60px]" />
                      )}
                      renderItem={({ item: expense, index }) => (
                        <Expense expense={expense} />
                      )}
                      recycleItems
                    />
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
          contentContainerClassName="p-4  "
        >
          <View className=" rounded-b-3xl pb-10 web:md:w-1/2 ">
            <Card />
          </View>
          <View className="flex flex-row justify-between items-center   w-full">
            <Text className="text-xl font-bold dark:text-white">
              Historial de Gastos
            </Text>
            <Text
              onPress={() => {
                setShowAll(true);
              }}
              className="text-muted-foreground dark:text-secondary px-1.5 opacity-50 "
            >
              Ver Más
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <LegendList
              data={expenses}
              contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}
              estimatedItemSize={320}
              recycleItems
              ItemSeparatorComponent={() => (
                <View className="h-[0.75px] bg-zinc-200 dark:bg-zinc-700 ml-[60px]" />
              )}
              renderItem={({ item: expense }) => <Expense expense={expense} />}
              ListEmptyComponent={
                <View className="flex flex-col items-center justify-center  ">
                  <NoData2Svg width={150} height={150} />
                  <View>
                    <Text className="text-center text-xl text-muted-foreground">
                      No hay gastos registrados
                    </Text>
                    <Text className="text-center text-sm text-muted-foreground">
                      Haz click en el botón "+" para registrar un gasto
                    </Text>
                  </View>
                </View>
              }
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
