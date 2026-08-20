import { format, isToday, isYesterday } from "date-fns";
import { IBudget, IExpense } from "@/interfaces";
import { es } from "date-fns/locale";

export type Transaction =
  | { kind: "budget"; budget: IBudget }
  | { kind: "expense"; expense: IExpense };

export const transactionDate = (t: Transaction): Date =>
  new Date(t.kind === "budget" ? t.budget.created_at : t.expense.date);

export const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: { [key: string]: Transaction[] }, t) => {
    const date = transactionDate(t);
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
    groups[dateLabel].push(t);
    return groups;
  }, {});
};