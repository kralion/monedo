import NoDataAsset from "@/assets/svgs/no-data.svg";
import { useExpenseContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useToastController } from "@tamagui/toast";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text, YStack } from "tamagui";

async function getExpensesDataByTimelineQuery(timelineQuery: string) {
  let startDate, endDate;
  switch (timelineQuery) {
    case "hoy":
      startDate = startOfDay(new Date()).toISOString();
      endDate = endOfDay(new Date()).toISOString();
      break;
    case "diario":
      startDate = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      endDate = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      break;
    case "semanal":
      startDate = startOfMonth(new Date()).toISOString();
      endDate = endOfMonth(new Date()).toISOString();
      break;
    case "mensual":
      startDate = startOfYear(new Date()).toISOString();
      endDate = endOfYear(new Date()).toISOString();
      break;
    default:
      throw new Error(`Invalid timelineQuery: ${timelineQuery}`);
  }
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("fecha", startDate)
    .lt("fecha", endDate);
  if (error) {
    console.log("Error al obtener los datos de la base de datos", error);
    return [];
  }

  return data;
}

export default function Chart({ timelineQuery }: { timelineQuery: string }) {
  const screenWidth = Dimensions.get("window").width;
  const toast = useToastController();
  const { user: userData } = useUser();
  const { expenses, getExpensesByUser } = useExpenseContext();
  React.useEffect(() => {
    if (userData) {
      getExpensesByUser(userData.id);
    }
  }, [userData, getExpensesByUser]);
  let labels;
  switch (timelineQuery) {
    case "hoy":
      labels = ["08:00", "11:00", "13:00", "17:00", "20:00", "24:00"];
      break;
    case "diario":
      labels = ["L", "M", "X", "J", "V", "S", "D"];
      break;
    case "semanal":
      labels = ["S1", "S2", "S3", "S4"];
      break;
    case "mensual":
      labels = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
      break;

    default:
      labels = expenses.map((expense) => {
        const date = new Date(expense.fecha);
        return format(date, "MMMM"); // e.g., May
      });
      break;
  }

  const data = expenses.map((expense) => {
    const monto = isFinite(expense.monto) ? expense.monto : 0;
    return monto;
  });
  if (data.length === 0) {
    return (
      <YStack gap="$4" justifyContent="center" alignItems="center">
        <NoDataAsset width={200} height={200} />
        <Text textAlign="center" px="$5">
          Aún no tienes gastos registrados para este nivel de periodicidad
        </Text>
      </YStack>
    );
  }

  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      width={450}
      style={{
        marginLeft: -35,
        marginBottom: -5,
      }}
      height={250}
      yAxisInterval={1}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#73B78F",
        backgroundGradientTo: "#73B78F",

        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(54, 137, 131, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(109, 104, 104, ${opacity})`,
        strokeWidth: 4,
        propsForBackgroundLines: {
          opacity: 0.1,
        },

        propsForDots: {
          r: "4",
          strokeWidth: 0,
          stroke: "#FEFED5",
          fill: "#368983",
        },
      }}
      bezier
    />
  );
}
