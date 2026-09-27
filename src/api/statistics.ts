import { db } from "@/db";
import { expenses, categories, incomes } from "@/schema";
import { eq, desc, sql } from "drizzle-orm";

type CategoryAggregate = {
  id_category: number;
  name: string;
  color: string;
  value: number;
};

export const getStatisticsData = async (userId: string) => {
  const [
    incomeTotals,
    expenseTotals,
    byCategoryRows,
    topIncomesRows,
    topExpensesRows,
  ] = await Promise.all([
    db
      .select({ value: sql<string>`SUM(${incomes.amount})` })
      .from(incomes)
      .where(eq(incomes.user_id, userId)),

    db
      .select({ value: sql<string>`SUM(${expenses.amount})` })
      .from(expenses)
      .where(eq(expenses.user_id, userId)),

    db
      .select({
        id_category: expenses.id_category,
        total: sql<string>`SUM(${expenses.amount})`,
        label: categories.label,
        color: categories.color,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.id_category, categories.id))
      .where(eq(expenses.user_id, userId))
      .groupBy(expenses.id_category, categories.label, categories.color)
      .orderBy(desc(sql`SUM(${expenses.amount})`)),

    db
      .select()
      .from(incomes)
      .where(eq(incomes.user_id, userId))
      .orderBy(desc(incomes.amount))
      .limit(10),

    db
      .select({
        id: expenses.id,
        amount: expenses.amount,
        currency: expenses.currency,
        date: expenses.date,
        description: expenses.description,
        id_category: expenses.id_category,
        number: expenses.number,
        periodicity: expenses.periodicity,
        user_id: expenses.user_id,
        categories: categories,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.id_category, categories.id))
      .where(eq(expenses.user_id, userId))
      .orderBy(desc(expenses.amount))
      .limit(10),
  ]);

  const totalIncome = Number(incomeTotals[0]?.value ?? 0);
  const totalExpenses = Number(expenseTotals[0]?.value ?? 0);

  const expensesByCategory: CategoryAggregate[] = byCategoryRows
    .map((row) => ({
      id_category: row.id_category as number,
      name: row.label ?? "",
      color: row.color ?? "#41D29B",
      value: Number(row.total ?? 0),
    }))
    // filter out null category if any (should not happen but safe)
    .filter((c) => c.value > 0);

  const topIncomes = topIncomesRows.map((r) => ({
    ...r,
    amount: Number(r.amount as unknown as string),
  }));

  const topExpenses = topExpensesRows.map((r) => ({
    ...r,
    amount: Number(r.amount as unknown as string),
  }));

  return {
    totalIncome,
    totalExpenses,
    expensesByCategory,
    topIncomes,
    topExpenses,
  };
};
