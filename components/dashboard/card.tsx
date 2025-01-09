import { useBudgetContext, useExpenseContext } from "@/context";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import {
  ChevronUpCircle,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
} from "lucide-react-native";

export default function Card() {
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const [budget, setBudget] = React.useState(0);
  const { has } = useAuth();
  const { sumOfAllOfExpensesMonthly, isOutOfBudget } = useExpenseContext();
  const { getTotalBudget } = useBudgetContext();

  async function calculateBalance() {
    await sumOfAllOfExpensesMonthly().then((total) => {
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
        if (has?.({ permission: "premium:plan" })) {
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
            : has?.({ permission: "premium:plan" })
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
                bg-${
                  has?.({ permission: "premium:plan" })
                    ? "yellow-500"
                    : "orange-500"
                }
                `}
          >
            <Text className="text-white">
              {has?.({ permission: "premium:plan" })
                ? "Cuenta Premium"
                : "Cuenta Free"}
            </Text>
          </Button>
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-col gap-2">
            <View className="flex flex-row">
              <Text className="text-white dark:text-zinc-700">Gastos</Text>
            </View>
            <View className="flex flex-row gap-1">
              <CircleArrowUpIcon color="white" />

              <Text className="text-xl text-white">
                S/. {totalMonthExpenses}
              </Text>
            </View>
          </View>

          <View className="flex flex-col gap-2">
            <View className="flex flex-row">
              <Text className="text-white dark:text-zinc-700">Presupuesto</Text>
            </View>
            <View className="flex flex-row gap-1">
              <CircleArrowDownIcon color="white" />

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
