import { useBudgetContext, useExpenseContext } from "@/context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "./ui/button";
import { BudgetLimitExceededModal } from "./budget-limit-exceeded";
import { IBudget } from "~/interfaces";

export default function AddExpenseIcon() {
  const router = useRouter();
  const { has } = useAuth();
  const [balance, setBalance] = React.useState<number>(0);
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const [budget, setBudget] = React.useState<IBudget | null>({} as IBudget);
  const [showModal, setShowModal] = React.useState(false);
  const { sumOfAllOfExpensesMonthly } = useExpenseContext();
  const { getCurrentBudget } = useBudgetContext();

  async function calculateTotalMonthExpenses() {
    const total = await sumOfAllOfExpensesMonthly();
    setTotalMonthExpenses(total);
    return total;
  }

  async function calculateBudget() {
    await getCurrentBudget().then((budget) => setBudget(budget));

    return budget;
  }

  async function calculateBalance() {
    const total = await calculateTotalMonthExpenses();
    const presupuesto = await calculateBudget();
    if (presupuesto) {
      setBalance(presupuesto.amount - total);
    }
  }

  React.useEffect(() => {
    calculateBalance();
  }, []);

  // React.useEffect(() => {
  //   if (balance <= 0) {
  //     setShowModal(true);
  //   }
  // }, [balance]);

  return (
    <>
      <View>
        {has?.({ permission: "premium:plan" }) ? (
          <Button
            size="icon"
            className="absolute -bottom-2 -right-9 rounded-full bg-yellow-500  h-auto w-auto p-4 shadow"
            onPress={() => {
              balance <= 0
                ? setShowModal(true)
                : router.push("/(auth)/(tabs)/add-expense");
            }}
          >
            <Plus strokeWidth={2.5} color="white" size={40} />
          </Button>
        ) : (
          <Button
            size="icon"
            className="absolute -bottom-2 -right-9 rounded-full  h-auto w-auto p-4 shadow active:scale-105  active:opacity-70 "
            onPress={() => {
              balance <= 0
                ? setShowModal(true)
                : router.push("/(auth)/(tabs)/add-expense");
            }}
          >
            <Plus strokeWidth={2.5} color="white" size={40} />
          </Button>
        )}
      </View>
      <BudgetLimitExceededModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  customTabStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    position: "absolute",
    marginBottom: -15,
    left: -35,
    bottom: 10,
    borderRadius: 50,
    padding: 10,
    shadowOpacity: 0.3,
    borderWidth: 1.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
