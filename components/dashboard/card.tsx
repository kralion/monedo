import { useBudgetContext } from "@/context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useExpenseStore } from "~/stores/expense";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function Card() {
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const [budget, setBudget] = React.useState(0);
  const { planName, isPremium } = useUserPlan();
  const { sumOfAllOfExpenses, isOutOfBudget } = useExpenseStore();
  const { getTotalBudget } = useBudgetContext();

  async function calculateBalance() {
    await sumOfAllOfExpenses().then((total) => {
      setTotalMonthExpenses(total);
    });
    await getTotalBudget().then((total) => {
      setBudget(total);
    });
    return budget - totalMonthExpenses;
  }

  useFocusEffect(
    React.useCallback(() => {
      calculateBalance();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      calculateBalance();
    }, [])
  );

  return (
    <Pressable
      className="m-5 z-10"
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
      style={styles.shadowContainer}
    >
      <LinearGradient
        colors={
          isOutOfBudget
            ? ["#FF0000", "#FF7F7F"] // Red gradient if out of budget
            : isPremium
            ? ["#D4AF37", "#FFD700", "#A79647"] // Gold gradient for premium users
            : ["#10B981", "#047857"] // Default gradient
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardStyle}
      >
        <View className="flex flex-row justify-between">
          <View>
            <Text className="text-xl text-white">Balance</Text>

            <Text className="text-4xl text-white font-bold ">
              S/. {budget - totalMonthExpenses}
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
            <View className="flex flex-row">
              <Text className="text-white ">Gastos</Text>
            </View>
            <View className="flex flex-row gap-2">
              <ArrowDownIcon color="white" />

              <Text className="text-xl text-white">
                S/. {totalMonthExpenses}
              </Text>
            </View>
          </View>

          <View className="flex flex-col gap-2">
            <View className="flex flex-row">
              <Text className="text-white ">Presupuesto</Text>
            </View>
            <View className="flex flex-row gap-2">
              <ArrowUpIcon color="white" />

              <Text className="text-xl text-white">S/. {budget}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: "100%",
    height: 200,
    zIndex: 100,
    position: "absolute",
    top: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  shadowContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.001)",
  },
});
