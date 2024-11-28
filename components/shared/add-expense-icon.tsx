import { useExpenseContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "../ui/button";

export default function AddExpenseIcon() {
  const router = useRouter();
  const { has } = useAuth();
  const [presupuesto, setPresupuesto] = React.useState(0);
  // TODO: get this from the actual month
  const { sumOfAllOfExpensesMonthly } = useExpenseContext();
  const [blockRoute, setBlockRoute] = React.useState(false);
  async function fetchExpenses() {
    const totalExpenses = await sumOfAllOfExpensesMonthly();
    setTotalMonthExpenses(totalExpenses);
  }
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const balance = presupuesto - totalMonthExpenses;
  const getLastBudget = async () => {
    const { data } = await supabase
      .from("presupuestos")
      .select("*")
      .order("fecha_final", {
        ascending: false,
      })
      .limit(1);
    if (data) {
      setPresupuesto(data[0].monto);
    }
  };
  // React.useEffect(() => {
  //   getLastBudget();
  //   fetchExpenses();
  // }, [blockRoute]);
  // React.useEffect(() => {
  //   if (balance <= 0) {
  //     setBlockRoute(true);
  //   }
  // }, [balance]);
  return (
    <View>
      {has?.({ permission: "premium:plan" }) ? (
        <Button
          size="icon"
          style={[
            styles.customTabStyle,
            {
              backgroundColor: "#FFD700",
              borderColor: "#FFE455",
            },
          ]}
          onPress={() => {
            if (blockRoute) {
              router.push("/(tabs)");
              // toast.show("No puedes añadir gastos tu balance es cero.");
            } else {
              router.push("/(tabs)/add-expense");
            }
          }}
        >
          <Plus color="white" size={40} />{" "}
        </Button>
      ) : (
        <Button
          size="icon"
          style={[
            styles.customTabStyle,
            {
              backgroundColor: "#6366F1",
              borderColor: "#979AEE",
            },
          ]}
          onPress={() => {
            if (blockRoute) {
              router.push("/(tabs)");
              // toast.show("No puedes añadir gastos tu balance es cero.");
            } else {
              router.push("/(tabs)/add-expense");
            }
          }}
        >
          <Plus color="white" size={40} />{" "}
        </Button>
      )}
    </View>
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
