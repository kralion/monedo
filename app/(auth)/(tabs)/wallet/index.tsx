import NoData2Svg from "@/assets/svgs/no-data.svg";
import { Budget } from "@/components/wallet/budget";
import { useBudgetContext } from "@/context";

import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { BudgetSkeleton } from "~/components/skeleton/budget";
import { Text } from "~/components/ui/text";
import { createClerkSupabaseClient } from "~/lib/supabase";

export default function Wallet() {
  const { budgets, getBudgets } = useBudgetContext();
  const [loading, setIsLoading] = React.useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const supabase = createClerkSupabaseClient();

  useEffect(() => {
    setIsLoading(true);
    getBudgets();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel("budgets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgets" },
        () => {
          getBudgets();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ListTotal = () => {
    const total = budgets.reduce(
      (accumulator, budget) => accumulator + budget.amount,
      0
    );
    return (
      <View className="flex flex-col items-center">
        <Image
          source={{
            uri: "https://img.icons8.com/?size=200&id=JQX2fDPyQq4E&format=png&color=000000",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View className="p-4 ">
          <Text className="  text-center mb-1 text-muted-foreground">
            Total en billetera
          </Text>
          <Text className="text-3xl font-bold text-black text-center">
            S/. {total}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      className="bg-white dark:bg-zinc-900"
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
    >
      <ListTotal />

      <View className="flex flex-col gap-3 rounded-b-xl p-4">
        {loading && (
          <View className="flex flex-col gap-2">
            <BudgetSkeleton />
            <BudgetSkeleton />
          </View>
        )}

        <FlashList
          data={budgets}
          estimatedItemSize={100}
          renderItem={({ item }) => <Budget budget={item} />}
          ListEmptyComponent={
            <View className="flex flex-col items-center justify-center  ">
              <NoData2Svg width={150} height={150} />
              <View>
                <Text className="text-center text-xl text-muted-foreground">
                  No hay presupuestos registrados
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  Rellena el formulario y registra uno para el mes actual.
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}
