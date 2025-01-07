import NoData2Svg from "@/assets/svgs/no-data.svg";
import Card from "@/components/dashboard/card";
import { useExpenseContext } from "@/context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router, useFocusEffect } from "expo-router";
import { ChevronUp, Lock } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Expense } from "~/components/expense";
import { ExpenseSkeleton } from "~/components/skeleton/expense";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { createClerkSupabaseClient } from "~/lib/supabase";

export default function Home() {
  const { getRecentExpenses, expenses } = useExpenseContext();
  const [loading, setLoading] = React.useState(false);
  const { user, isSignedIn } = useUser();
  const { has } = useAuth();
  const supabase = createClerkSupabaseClient();
  const [showAll, setShowAll] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getRecentExpenses();
      setLoading(false);
      const channel = supabase.channel("realtime-expenses");
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        () => {
          getRecentExpenses();
        }
      );
      return () => {
        channel.unsubscribe();
      };
    }, [])
  );

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
    router.replace("/(auth)/sign-in");
  }

  return (
    <View>
      {showAll ? (
        <Animated.View style={{ opacity: 60 }}>
          <SafeAreaView className="p-4">
            <View className="flex flex-col gap-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-bold">Gastos Recientes</Text>
                <Text
                  onPress={() => {
                    setShowAll(false);
                  }}
                  className="text-muted-foreground px-1.5 opacity-50 "
                >
                  Ver Menos
                </Text>
              </View>
              <ScrollView className="h-screen-safe">
                <FlashList
                  data={expenses}
                  estimatedItemSize={200}
                  renderItem={({ item: expense }) => (
                    <Expense expense={expense} />
                  )}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            className={`pt-16  rounded-b-3xl
             bg-${
               has?.({ permission: "premium:plan" }) ? "yellow-500" : "primary"
             }

              `}
          >
            <View className="flex flex-row justify-between items-center px-4">
              <View className="flex flex-col">
                <Text className="text-sm">
                  {capitalizeFirstLetter(
                    new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  )}
                </Text>
                <Text className="font-bold text-xl">
                  Hola, {user?.firstName} 👋
                </Text>
              </View>

              <Button
                onPress={() => router.push("/(modals)/buy-premium")}
                size="icon"
                variant="outline"
                className="rounded-full"
              >
                <Lock color="#27BE8B" size={20} />
              </Button>
            </View>
            <Card />
            <View style={{ height: 120 }} />
          </View>

          <ScrollView ref={scrollRef} className="px-4">
            <View className="flex flex-row justify-between items-center pt-36  w-full pb-4">
              <Text className="text-xl font-bold">Gastos Recientes</Text>
              <Text
                onPress={() => {
                  setShowAll(true);
                }}
                className="text-muted-foreground px-1.5 opacity-50 "
              >
                Ver Todos
              </Text>
            </View>
            {loading ? (
              <View className="flex flex-col gap-2">
                <ExpenseSkeleton />
                <ExpenseSkeleton />
                <ExpenseSkeleton />
              </View>
            ) : (
              <FlashList
                data={expenses}
                contentContainerClassName="pb-[400px]"
                estimatedItemSize={200}
                renderItem={({ item: expense }) => (
                  <Expense expense={expense} />
                )}
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
            <Animated.View style={[buttonStyle]}>
              <Button
                onPress={scrollToTop}
                size="icon"
                variant="outline"
                className="w-14 h-14 rounded-full absolute z-50 right-2 bottom-12 shadow-xl"
              >
                <ChevronUp color="gray" />
              </Button>
            </Animated.View>
          </ScrollView>
        </>
      )}
    </View>
  );
}
