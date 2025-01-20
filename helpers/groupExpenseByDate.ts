import { format, isToday, isYesterday } from "date-fns";
import { IExpense } from "~/interfaces";
import { es } from "date-fns/locale";

export const groupExpensesByDate = (expenses: IExpense[]) => {
  return expenses.reduce((groups: { [key: string]: IExpense[] }, expense) => {
    const date = new Date(expense.date);
    let dateLabel;
    if (isToday(date)) {
      dateLabel = "Hoy";
    } else if (isYesterday(date)) {
      dateLabel = "Ayer";
    } else {
      dateLabel = format(date, "dd 'de' MMMM", { locale: es });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(expense);
    return groups;
  }, {});
};
