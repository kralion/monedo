import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db.server";
import { expenses, categories } from "@/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export const getRecentExpensesFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
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
      .where(eq(expenses.user_id, data.userId))
      .orderBy(desc(expenses.date))
      .limit(20);

    return result.map((e) => ({
      ...e,
      amount: Number(e.amount as unknown as string),
    }));
  },
);

export const getTotalExpensesFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({ amount: expenses.amount })
      .from(expenses)
      .where(eq(expenses.user_id, data.userId));
    return result.reduce((sum, r) => sum + Number(r.amount), 0);
  },
);

export const getExpensesByPeriodicityFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { startTimeOfQuery: string; endTimeOfQuery: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
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
      .where(
        and(
          gte(expenses.date, data.startTimeOfQuery),
          lte(expenses.date, data.endTimeOfQuery),
        ),
      )
      .orderBy(desc(expenses.amount))
      .limit(15);

    return result.map((e) => ({
      ...e,
      amount: Number(e.amount as unknown as string),
    }));
  },
);

export const getAllExpensesSortedByAmountFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
  const result = await db
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
    .where(eq(expenses.user_id, data.userId))
    .orderBy(desc(expenses.amount));

  return result.map((e) => ({
    ...e,
    amount: Number(e.amount as unknown as string),
  }));
});

export const getExpenseByIdFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
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
      .where(eq(expenses.id, data.id));

    if (!row) throw new Error("Expense not found");
    return { ...row, amount: Number(row.amount as unknown as string) };
  },
);

export const addExpenseFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      amount: string;
      currency?: string | null;
      date: string;
      description?: string | null;
      id_category?: number | null;
      number: number;
      periodicity?: boolean | null;
      user_id: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(expenses)
      .values({
        amount: data.amount,
        currency: data.currency,
        date: data.date,
        description: data.description,
        id_category: data.id_category,
        number: data.number,
        periodicity: data.periodicity,
        user_id: data.user_id,
      })
      .returning();
    if (!row) throw new Error("No data returned");
    return { ...row, amount: Number(row.amount as unknown as string) };
  },
);

export const updateExpenseFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: number;
      amount: string;
      currency?: string | null;
      date: string;
      description?: string | null;
      id_category?: number | null;
      number: number;
      periodicity?: boolean | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .update(expenses)
      .set({
        amount: data.amount,
        currency: data.currency,
        date: data.date,
        description: data.description,
        id_category: data.id_category,
        number: data.number,
        periodicity: data.periodicity,
      })
      .where(eq(expenses.id, data.id))
      .returning();
    if (!row) throw new Error("No data returned");
    return { ...row, amount: Number(row.amount as unknown as string) };
  },
);

export const deleteExpenseFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(expenses).where(eq(expenses.id, data.id));
    return { success: true };
  },
);

export const getExpensesByCategoryFn = createServerFn({ method: "GET" })
  .inputValidator((data: { categoryId: number }) => data)
  .handler(async ({ data }) => {
    const result = await db
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
      .where(eq(expenses.id_category, data.categoryId));

    return result.map((e) => ({
      ...e,
      amount: Number(e.amount as unknown as string),
    }));
  },
);

export const getExpensesPaginatedFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string; limit: number; offset: number }) => data)
  .handler(async ({ data }) => {
    const result = await db
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
      .where(eq(expenses.user_id, data.userId))
      .orderBy(desc(expenses.date))
      .limit(data.limit)
      .offset(data.offset);

    return result.map((e) => ({
      ...e,
      amount: Number(e.amount as unknown as string),
    }));
  },
);
