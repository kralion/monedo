import NoData2Svg from "@/assets/svgs/no-data.svg";
import { Budget } from "@/components/wallet/budget";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { BudgetSkeleton } from "~/components/skeleton/budget";
import { Text } from "~/components/ui/text";
import { useBudgetStore } from "~/stores/budget";

export default function Wallet() {
  const { budgets, getBudgets } = useBudgetStore();
  const [loading, setIsLoading] = useState(false);
  const { user } = useUser();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  useEffect(() => {
    setIsLoading(true);
    getBudgets(user?.id as string);
    setIsLoading(false);
  }, []);

  const ListTotal = () => {
    const total = budgets.reduce(
      (accumulator, budget) => accumulator + budget.amount,
      0
    );
    return (
      <View className="flex flex-col items-center web:md:py-8">
        <Image
          source={{
            uri: "https://img.icons8.com/?size=200&id=JQX2fDPyQq4E&format=png&color=000000",
          }}
          style={{ width: 100, height: 100 }}
          className="web:md:w-32 web:md:h-32"
        />
        <View className="p-4">
          <Text className="text-center mb-1 text-muted-foreground web:md:text-lg">
            Total en billetera
          </Text>
          <Text className="text-3xl font-bold text-black dark:text-white text-center web:md:text-4xl">
            S/ {total}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      className="bg-white dark:bg-zinc-900 web:md:max-w-4xl web:md:mx-auto"
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      contentContainerClassName="web:md:px-6"
    >
      <ListTotal />

      <View className="flex flex-col gap-3 rounded-b-xl p-4 web:md:px-6">
        {loading && (
          <View className="flex flex-col gap-2">
            <BudgetSkeleton />
            <BudgetSkeleton />
          </View>
        )}

        <View className="flex-1">
          <FlashList
            data={budgets}
            scrollsToTop
            estimatedItemSize={320}
            contentContainerClassName="web:md:px-4"
            renderItem={({ item }) => <Budget budget={item} />}
            ListEmptyComponent={
              <View className="flex flex-col items-center justify-center py-8">
                <NoData2Svg width={150} height={150} />
                <View>
                  <Text className="text-center text-xl text-muted-foreground web:md:text-2xl">
                    No hay presupuestos registrados
                  </Text>
                  <Text className="text-center text-sm text-muted-foreground web:md:text-base">
                    Rellena el formulario y registra uno para el mes actual.
                  </Text>
                </View>
              </View>
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}
