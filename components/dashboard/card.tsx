import { useExpenseContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BudgetLimitExceededModal } from "../popups/budget-limit-exceeded";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function Card() {
  const flip = useSharedValue(0);
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const { user: userData } = useUser();
  const { has } = useAuth();
  // TODO: get this from the actual month
  const { sumOfAllOfExpensesMonthly } = useExpenseContext();
  const [showModal, setShowModal] = React.useState(false);
  const [presupuesto, setPresupuesto] = React.useState(0);
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

  const animatedStyles = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flip.value,
      [0, 1],
      [0, 360],
      Extrapolation.CLAMP
    );
    const rotateX = interpolate(
      flip.value,
      [0, 0.5, 1],
      [30, 0, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 }, // Add perspective to enhance 3D effect
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
      ],
      backfaceVisibility: "hidden",
    };
  });

  React.useEffect(() => {
    async function fetchExpenses() {
      const totalExpenses = await sumOfAllOfExpensesMonthly();
      setTotalMonthExpenses(totalExpenses);
    }
    getLastBudget();
    fetchExpenses();
  }, [userData]);

  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    flip.value = withTiming(1, { duration: 2000 });
  }, []);

  const balance = presupuesto - totalMonthExpenses;

  React.useEffect(() => {
    if (balance <= 0) {
      setShowModal(true);
    }
  }, [balance]);
  return (
    <Animated.View style={[styles.cardStyle, animatedStyles]}>
      <Pressable
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
              <Text className="text-3xl text-white font-bold">
                S/. {balance}
              </Text>
            </View>
            <BudgetLimitExceededModal
              setShowModal={setShowModal}
              showModal={showModal}
            />
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
                S/. {totalMonthExpenses}
              </Text>
            </View>

            <View className="flex flex-col">
              <View className="flex flex-row">
                <Text className="text-white">Presupuesto</Text>
              </View>
              <Text className="text-xl text-white">S/. {presupuesto}</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: "100%",
    height: 200,
    zIndex: 100,
    position: "absolute",
    top: 60,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 20,
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
