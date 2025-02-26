import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowDownCircle,
  ArrowDownIcon,
  ArrowUpCircle,
  ArrowUpIcon,
} from "lucide-react-native";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View, Dimensions } from "react-native";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useUser } from "@clerk/clerk-expo";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Image } from "expo-image";

export default function Card() {
  const { planName, isPremium } = useUserPlan();
  const { user } = useUser();
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { totalBudget, isOutOfBudget, getTotalBudget } = useBudgetStore();
  const { width } = Dimensions.get("window");
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
      className="z-10 web:md:max-w-4xl web:md:mx-auto"
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
      <View
        className="relative w-full
      mx-auto my-6 h-[200px] web:md:h-[220px] web:md:w-[420px]"
      >
        <Animated.View entering={FadeInDown}>
          <View
            className={`absolute top-16 ${
              isPremium ? "bg-black/70" : "bg-green-800"
            } shadow-sm rounded-xl w-full h-[200px] scale-[0.75] web:md:h-[220px]`}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown}>
          <View
            className={`absolute top-8 ${
              isPremium ? "bg-black/90" : "bg-green-700"
            } shadow-sm rounded-xl w-full h-[200px] scale-[0.90] web:md:h-[220px]`}
          />
        </Animated.View>
        <Animated.View entering={FadeInUp}>
          <LinearGradient
            colors={
              isOutOfBudget
                ? ["#FF0000", "#FF7F7F"]
                : isPremium
                ? ["#000000", "#353535", "#000000"]
                : ["#10B981", "#047857"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.cardStyle, { height: width < 768 ? 200 : 220 }]}
            className="web:md:rounded-2xl"
          >
            <View className="flex flex-row justify-between">
              <View className="flex flex-col gap-2">
                <Text className="text-xl text-white web:md:text-2xl">
                  Balance
                </Text>

                <Text className="text-4xl text-white font-bold web:md:text-5xl">
                  S/ {totalBudget - totalExpenses}
                </Text>
              </View>

              {!isPremium && (
                <Button
                  size="sm"
                  className="rounded-full
                 bg-orange-500"
                >
                  <Text className="text-white">Cuenta {planName}</Text>
                </Button>
              )}
              {isPremium && (
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=100&id=kiERC418GbAI&format=png&color=000000",
                  }}
                  style={{ width: 50, height: 50, borderRadius: 24 }}
                />
              )}
            </View>
            <View className="flex flex-row justify-between">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row gap-1 items-center">
                  <ArrowDownCircle color="white" size={16} />
                  <Text className="text-white web:md:text-lg">Gastos</Text>
                </View>
                <Text className="text-xl text-white web:md:text-2xl">
                  S/ {totalExpenses}
                </Text>
              </View>

              <View className="flex flex-col gap-2 items-end">
                <View className="flex flex-row gap-1 items-center">
                  <ArrowUpCircle color="white" size={16} />
                  <Text className="text-white web:md:text-lg">Billetera</Text>
                </View>
                <Text className="text-xl text-white web:md:text-2xl">
                  S/ {totalBudget}
                </Text>
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
