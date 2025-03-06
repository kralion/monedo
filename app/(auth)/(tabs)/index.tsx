import NoData2Svg from "@/assets/svgs/no-data.svg";
import Card from "@/components/dashboard/card";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { Redirect, router } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Expense } from "~/components/expense";
import { Text } from "~/components/ui/text";
import { groupExpensesByDate } from "~/helpers/groupExpenseByDate";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import type { ConfettiMethods } from "react-native-fast-confetti";
import { Confetti } from "react-native-fast-confetti";
import { useUserPlan } from "~/hooks/useUserPlan";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const { isPremium } = useUserPlan();
  const { checkBudget } = useBudgetStore();
  const [showAll, setShowAll] = React.useState(false);
  const confettiRef = React.useRef<ConfettiMethods>(null);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getRecentExpenses(user?.id as string);
    checkBudget(user?.id as string);
    setRefreshing(false);
  };
  const { getRecentExpenses, expenses } = useExpenseStore();
  React.useEffect(() => {
    setLoading(true);
    getRecentExpenses(user?.id as string);
    setLoading(false);
  }, []);
  if (!expenses) {
    return <ActivityIndicator />;
  }
  if (!user) {
    <Redirect href="/(public)/sign-in" />;
    return;
  }

  if (!isSignedIn) {
    router.replace("/(public)/sign-in");
  }

  const parsedExpenses = expenses.map((expense) => ({
    ...expense,
    date: new Date(expense.date),
  }));

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      {showAll ? (
        <ScrollView
          className="web:md:max-w-4xl"
          contentContainerClassName="pb-14 flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Animated.View style={{ opacity: 60 }}>
            <View>
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-end items-end px-4 web:md:px-6">
                  <Text
                    onPress={() => {
                      setShowAll(false);
                    }}
                    className="text-muted-foreground px-1.5 opacity-50 web:md:text-base"
                  >
                    Ver Menos
                  </Text>
                </View>

                {Object.keys(groupExpensesByDate(parsedExpenses)).map(
                  (dateLabel) => (
                    <View key={dateLabel}>
                      <Text className="text-lg px-4 web:md:px-6 text-muted-foreground web:md:text-xl">
                        {dateLabel}
                      </Text>
                      <View className="flex-1">
                        <FlashList
                          contentContainerStyle={{
                            paddingBottom: 16,
                          }}
                          contentContainerClassName="px-4 web:md:px-6"
                          data={groupExpensesByDate(parsedExpenses)[dateLabel]}
                          estimatedItemSize={400}
                          scrollsToTop
                          ItemSeparatorComponent={() => (
                            <View className="h-[0.75px] bg-zinc-200 dark:bg-zinc-700 ml-[60px]" />
                          )}
                          renderItem={({ item: expense, index }) => {
                            return <Expense expense={expense} />;
                          }}
                        />
                      </View>
                    </View>
                  )
                )}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 web:md:max-w-4xl"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerClassName="px-4 pb-28 web:md:px-6"
        >
          <View className="rounded-b-3xl pb-10 web:md:pb-12">
            <Card />
          </View>
          <View className="flex flex-row justify-between items-center w-full web:md:mt-6">
            <Text className="text-xl font-bold dark:text-white web:md:text-2xl">
              Historial de Gastos
            </Text>
            <Text
              onPress={() => {
                setShowAll(true);
              }}
              className="text-muted-foreground dark:text-secondary px-1.5 opacity-50 web:md:text-base"
            >
              Ver más
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-1">
              <FlashList
                data={parsedExpenses}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 48 }}
                contentContainerClassName="web:md:px-2"
                estimatedItemSize={320}
                scrollsToTop
                ItemSeparatorComponent={() => (
                  <View className="h-[0.75px] bg-zinc-200 dark:bg-zinc-700 ml-[60px]" />
                )}
                renderItem={({ item: expense }) => {
                  return <Expense expense={expense} />;
                }}
                ListEmptyComponent={
                  <View className="flex flex-col items-center justify-center">
                    <NoData2Svg width={150} height={150} />
                    <View>
                      <Text className="text-center text-xl text-muted-foreground web:md:text-2xl">
                        No hay gastos registrados
                      </Text>
                      <Text className="text-center text-sm text-muted-foreground web:md:text-base">
                        Haz click en el botón "+" para registrar un gasto
                      </Text>
                    </View>
                  </View>
                }
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
