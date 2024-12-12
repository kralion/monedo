import { useBudgetContext, useExpenseContext } from "@/context";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function Card() {
  const [balance, setBalance] = React.useState(0);
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const [budget, setBudget] = React.useState(0);
  const { has } = useAuth();
  const { sumOfAllOfExpensesMonthly } = useExpenseContext();
  const { getMonthlyBudget } = useBudgetContext();

  async function calculateTotalMonthExpenses() {
    const total = await sumOfAllOfExpensesMonthly();
    setTotalMonthExpenses(total);
    return total;
  }

  async function calculateBudget() {
    const budget = await getMonthlyBudget();
    setBudget(budget);
    return budget;
  }

  async function calculateBalance() {
    const total = await calculateTotalMonthExpenses();
    const presupuesto = await calculateBudget();
    setBalance(presupuesto - total);
  }

  React.useEffect(() => {
    calculateBalance();
  }, []);

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
          router.push("/(modals)/buy-premium");
        }
      }}
      style={styles.shadowContainer}
    >
      <LinearGradient
        colors={
          has?.({ permission: "premium:plan" })
            ? ["#D4AF37", "#FFD700", "#A79647"]
            : ["#10B981", "#047857"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardStyle}
      >
        <View className="flex flex-row justify-between">
          <View>
            <Text className="text-xl text-white">Balance</Text>
            <Text className="text-4xl text-white font-bold">
              S/. {balance.toFixed(2)}
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
            <Text>
              {has?.({ permission: "premium:plan" })
                ? "Cuenta Premium"
                : "Cuenta Free"}
            </Text>
          </Button>
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-col ">
            <View className="flex flex-row">
              <Text className="text-white">Gastos</Text>
            </View>
            <Text className="text-xl text-white">
              S/. {totalMonthExpenses.toFixed(2)}
            </Text>
          </View>

          <View className="flex flex-col">
            <View className="flex flex-row">
              <Text className="text-white">Presupuesto</Text>
            </View>
            <Text className="text-xl text-white">S/. {budget.toFixed(2)}</Text>
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
    top: 30,
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
