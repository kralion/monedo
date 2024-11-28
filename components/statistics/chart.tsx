import NoDataAsset from "@/assets/svgs/no-data.svg";
import { useExpenseContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Text } from "../ui/text";

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
  const { user: userData } = useUser();
  const dataSample = [
    { value: 15 },
    { value: 30 },
    { value: 26 },
    { value: 40 },
  ];
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
      <View className="flex flex-col gap-4 justify-center items-center">
        <NoDataAsset width={200} height={200} />
        <Text className="text-center px-5">
          Aún no tienes gastos registrados para este nivel de periodicidad
        </Text>
      </View>
    );
  }

  return (
    <LineChart
      areaChart
      curved
      data={dataSample}
      showVerticalLines
      spacing={44}
      initialSpacing={0}
      color1="skyblue"
      color2="orange"
      textColor1="green"
      hideDataPoints
      dataPointsColor1="blue"
      dataPointsColor2="red"
      startFillColor1="skyblue"
      startFillColor2="orange"
      startOpacity={0.8}
      endOpacity={0.3}
      width={450}
      height={250}
    />
  );
}
