import NoData2Svg from "@/assets/svgs/no-data.svg";
import { Budget } from "@/components/wallet/budget";
import { useBudgetContext } from "@/context";

import { FlashList } from "@shopify/flash-list";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { BudgetSkeleton } from "~/components/skeleton/budget";
import { Text } from "~/components/ui/text";

export default function Wallet() {
  const { budgets, getBudgets, loading } = useBudgetContext();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  useEffect(() => {
    getBudgets();
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
    >
      <View className="flex flex-col gap-3 rounded-b-xl px-4">
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
