import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowDownCircle,
  ArrowDownIcon,
  ArrowUpCircle,
  ArrowUpIcon,
} from "lucide-react-native";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useUser } from "@clerk/clerk-expo";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Card() {
  const { planName, isPremium } = useUserPlan();
  const { user } = useUser();
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { totalBudget, isOutOfBudget, getTotalBudget } = useBudgetStore();
  async function calculateBalance() {
    await sumOfAllOfExpenses(user?.id as string);
    await getTotalBudget(user?.id as string);
    return totalBudget - totalExpenses;
  }
  useFocusEffect(
    React.useCallback(() => {
      calculateBalance();
    }, [])
  );

  return (
    <Pressable
      className=" z-10"
      onPress={() => {
        if (isPremium) {
          Alert.alert(
            "Premium",
            "Ya eres usuario premium, tienes acceso a todas las funcionalidades."
          );
        } else {
          router.push("/(auth)/(modals)/buy-premium");
        }
      }}
    >
      <View className="relative w-[90%] mx-auto my-10   h-[200px] ">
        <Animated.View entering={FadeInDown}>
          <View className="absolute top-16 bg-green-800 shadow-sm rounded-xl w-full h-[200px] scale-[0.70]" />
        </Animated.View>
        <Animated.View entering={FadeInDown}>
          <View className="absolute top-8 bg-green-700 shadow-sm rounded-xl w-full h-[200px] scale-[0.85]" />
        </Animated.View>
        <Animated.View entering={FadeInUp}>
          <LinearGradient
            colors={
              isOutOfBudget
                ? ["#FF0000", "#FF7F7F"]
                : isPremium
                ? ["#D4AF37", "#FFD700", "#A79647"]
                : ["#10B981", "#047857"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardStyle}
          >
            <View className="flex flex-row justify-between">
              <View className="flex flex-col gap-2">
                <Text className="text-xl text-white">Balance</Text>

                <Text className="text-4xl text-white font-bold ">
                  S/ {totalBudget - totalExpenses}
                </Text>
              </View>

              <Button
                size="sm"
                className={` rounded-full
                bg-${isPremium ? "yellow-500" : "orange-500"}
                `}
              >
                <Text className="text-white">Cuenta {planName}</Text>
              </Button>
            </View>
            <View className="flex flex-row justify-between">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row gap-1 items-center">
                  <ArrowDownCircle color="white" size={16} />
                  <Text className="text-white ">Gastos</Text>
                </View>
                <Text className="text-xl text-white">S/ {totalExpenses}</Text>
              </View>

              <View className="flex flex-col gap-2 items-end">
                <View className="flex flex-row gap-1 items-center">
                  <ArrowUpCircle color="white" size={16} />
                  <Text className="text-white ">Billetera</Text>
                </View>
                <Text className="text-xl text-white">S/ {totalBudget}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: "100%",
    height: 200,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
