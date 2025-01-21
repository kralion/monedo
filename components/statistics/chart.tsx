import NoDataAsset from "@/assets/svgs/no-data.svg";
import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { IExpense } from "~/interfaces";
import { Text } from "../ui/text";
import { Dimensions } from "react-native";
const width = Dimensions.get("window").width;

interface ChartDataPoint {
  label: string;
  value: number;
  dataPointText: string;
}
type ChartProps = {
  timelineQuery: {
    value: string;
    label: string;
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  };
  data: IExpense[];
};
export default function Chart({ timelineQuery, data }: ChartProps) {
  const aggregateData = (
    data: IExpense[],
    timeLabels: string[],
    getTimeKey: (date: Date) => string
  ): ChartDataPoint[] => {
    const totals = new Map<string, number>();
    data.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const key = getTimeKey(expenseDate);
      totals.set(key, (totals.get(key) || 0) + expense.amount);
    });
    const result = timeLabels.map((label) => ({
      label,
      value: totals.get(label) || 0,
      dataPointText: String(totals.get(label) || 0),
    }));
    return result;
  };

  let chartData: ChartDataPoint[] = [];
  switch (timelineQuery.value) {
    case "hoy": {
      const hours = [
        "05:00",
        "08:00",
        "11:00",
        "14:00",
        "17:00",
        "20:00",
        "23:59",
      ];
      chartData = aggregateData(
        data,
        hours,
        (date) => `${date.getHours().toString().padStart(2, "0")}:00`
      );
      break;
    }
    case "diario": {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date
          .toLocaleDateString("es-ES", { weekday: "short" })
          .toUpperCase();
      });
      chartData = aggregateData(data, days, (date) =>
        date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
      );
      break;
    }
    case "semanal": {
      const weeks = Array.from({ length: 4 }, (_, i) => `S ${4 - i}`);
      chartData = aggregateData(data, weeks, (date) => {
        const weekNumber = Math.ceil(date.getDate() / 7);
        return `S ${weekNumber}`;
      });
      break;
    }
    case "mensual": {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date
          .toLocaleDateString("es-ES", { month: "short" })
          .toUpperCase();
      });
      chartData = aggregateData(data, months, (date) =>
        date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
      );
      break;
    }
  }
  if (data.length === 0) {
    return (
      <View className="flex flex-col items-center justify-center gap-5  ">
        <NoDataAsset width={100} height={100} />
        <View>
          <Text className="text-center text-xl text-muted-foreground">
            Sin datos
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            Para este filtro no hay gastos registrados aún
          </Text>
        </View>
      </View>
    );
  }

  return (
    <LineChart
      areaChart
      curved
      data={chartData}
      spacing={timelineQuery.value === "semanal" ? width * 0.28 : width * 0.14}
      yAxisColor="gray"
      xAxisColor="white"
      yAxisThickness={0}
      color1="#41D29B"
      hideYAxisText
      dataPointsColor1="#41D29B"
      hideRules
      endSpacing={-20}
      startFillColor1="#41D29B"
      startOpacity={0.8}
      height={250}
    />
  );
}
