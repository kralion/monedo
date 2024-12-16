import { startOfDay, endOfDay, subDays } from "date-fns";
export const getDateRange = (timelineType: string) => {
  const now = new Date();
  switch (timelineType) {
    case "hoy":
      return {
        startTimeOfQuery: startOfDay(now),
        endTimeOfQuery: endOfDay(now),
      };
    case "diario":
      return {
        startTimeOfQuery: startOfDay(subDays(now, 1)),
        endTimeOfQuery: endOfDay(now),
      };
    case "semanal":
      return {
        startTimeOfQuery: startOfDay(subDays(now, 7)),
        endTimeOfQuery: endOfDay(now),
      };
    case "mensual":
      return {
        startTimeOfQuery: startOfDay(subDays(now, 30)),
        endTimeOfQuery: endOfDay(now),
      };
    default:
      return {
        startTimeOfQuery: startOfDay(subDays(now, 1)),
        endTimeOfQuery: endOfDay(now),
      };
  }
};
