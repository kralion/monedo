import { db } from "@/db";
import { expenses, categories } from "@/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

const expenseSelection = {
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
};

export const getRecentExpenses = async (userId: string) => {
  const result = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(eq(expenses.user_id, userId))
    .orderBy(desc(expenses.date))
    .limit(20);

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
};

export const getTotalExpenses = async (userId: string) => {
  const result = await db
    .select({ amount: expenses.amount })
    .from(expenses)
    .where(eq(expenses.user_id, userId));
  return result.reduce((sum, r) => sum + Number(r.amount), 0);
};

export const getExpensesByPeriodicity = async ({
  startTimeOfQuery,
  endTimeOfQuery,
}: {
  startTimeOfQuery: string;
  endTimeOfQuery: string;
}) => {
  const result = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(
      and(gte(expenses.date, startTimeOfQuery), lte(expenses.date, endTimeOfQuery)),
    )
    .orderBy(desc(expenses.amount))
    .limit(15);

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
};

export const getAllExpensesSortedByAmount = async (userId: string) => {
  const result = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(eq(expenses.user_id, userId))
    .orderBy(desc(expenses.amount));

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
};

export const getExpenseById = async (id: number) => {
  const [row] = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(eq(expenses.id, id));

  if (!row) throw new Error("Expense not found");
  return { ...row, amount: Number(row.amount as unknown as string) };
};

export type AddExpenseInput = {
  amount: string;
  currency?: string | null;
  date: string;
  description?: string | null;
  id_category?: number | null;
  number: number;
  periodicity?: boolean | null;
  user_id: string;
};

export const addExpense = async ({
  amount,
  currency,
  date,
  description,
  id_category,
  number,
  periodicity,
  user_id,
}: AddExpenseInput) => {
  const [row] = await db
    .insert(expenses)
    .values({
      amount,
      currency,
      date,
      description,
      id_category,
      number,
      periodicity,
      user_id,
    })
    .returning();
  if (!row) throw new Error("No data returned");
  return { ...row, amount: Number(row.amount as unknown as string) };
};

export type UpdateExpenseInput = {
  id: number;
  amount: string;
  currency?: string | null;
  date: string;
  description?: string | null;
  id_category?: number | null;
  number: number;
  periodicity?: boolean | null;
};

export const updateExpense = async ({
  id,
  amount,
  currency,
  date,
  description,
  id_category,
  number,
  periodicity,
}: UpdateExpenseInput) => {
  const [row] = await db
    .update(expenses)
    .set({
      amount,
      currency,
      date,
      description,
      id_category,
      number,
      periodicity,
    })
    .where(eq(expenses.id, id))
    .returning();
  if (!row) throw new Error("No data returned");
  return { ...row, amount: Number(row.amount as unknown as string) };
};

export const deleteExpense = async (id: number) => {
  await db.delete(expenses).where(eq(expenses.id, id));
  return { success: true };
};

export const getExpensesByCategory = async (categoryId: number) => {
  const result = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(eq(expenses.id_category, categoryId));

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
};

export const getExpensesPaginated = async (userId: string, limit: number, offset: number) => {
  const result = await db
    .select(expenseSelection)
    .from(expenses)
    .leftJoin(categories, eq(expenses.id_category, categories.id))
    .where(eq(expenses.user_id, userId))
    .orderBy(desc(expenses.date))
    .limit(limit)
    .offset(offset);

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
};
