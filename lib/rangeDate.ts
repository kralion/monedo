import { startOfDay, endOfDay, subDays, subMonths } from "date-fns";

export const getDateRange = (timelineType: string) => {
  const now = new Date();
  switch (timelineType) {
    case "hoy":
      return {
        startTimeOfQuery: startOfDay(now),
        endTimeOfQuery: endOfDay(now),
        value: "hoy",
        label: "Hoy",
      };
    case "diario":
      return {
        startTimeOfQuery: startOfDay(subDays(now, 7)),
        endTimeOfQuery: endOfDay(now),
        value: "diario",
        label: "Diario",
      };
    case "semanal":
      return {
        startTimeOfQuery: startOfDay(subDays(now, 28)),
        endTimeOfQuery: endOfDay(now),
        value: "semanal",
        label: "Semanal",
      };
    case "mensual":
      return {
        startTimeOfQuery: startOfDay(subMonths(now, 12)),
        endTimeOfQuery: endOfDay(now),
        value: "mensual",
        label: "Mensual",
      };
    default:
      return {
        startTimeOfQuery: startOfDay(now),
        endTimeOfQuery: endOfDay(now),
        value: "hoy",
        label: "Hoy",
      };
  }
};
