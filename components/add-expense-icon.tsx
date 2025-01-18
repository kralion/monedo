import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { BudgetLimitExceededModal } from "./budget-limit-exceeded";
import { Button } from "./ui/button";

export default function AddExpenseIcon() {
  const router = useRouter();
  const { isPremium } = useUserPlan();
  const [balance, setBalance] = React.useState<number>(0);
  const [showModal, setShowModal] = React.useState(false);
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { getTotalBudget, totalBudget } = useBudgetStore();

  async function calculateBalance() {
    await getTotalBudget();
    await sumOfAllOfExpenses();
    setBalance(totalBudget - totalExpenses);
  }
  React.useEffect(() => {
    calculateBalance();
    console.log("rendering");
  }, [totalBudget]);

  return (
    <>
      <View>
        {isPremium ? (
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
