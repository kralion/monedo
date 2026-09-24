import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db.server";
import { debts } from "@/schema";
import { eq, desc } from "drizzle-orm";

export const getDebtsFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    return db.select().from(debts).where(eq(debts.user_id, data.userId)).orderBy(desc(debts.created_at));
  },
);

export const getDebtByIdFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(debts).where(eq(debts.id, data.id));
    if (!row) throw new Error("Debt not found");
    return row;
  },
);

export const addDebtFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      user_id: string;
      name: string;
      amount: number;
      original_amount?: number | null;
      creditor?: string | null;
      notes?: string | null;
      status: "active" | "paid" | "overdue" | "partial";
    }) => data,
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(debts)
      .values({
        user_id: data.user_id,
        name: data.name,
        amount: data.amount,
        original_amount: data.original_amount,
        creditor: data.creditor,
        notes: data.notes,
        status: data.status,
      })
      .returning();
    if (!row) throw new Error("No data returned");
    return row;
  },
);

export const updateDebtFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: number;
      name: string;
      amount: number;
      original_amount?: number | null;
      creditor?: string | null;
      notes?: string | null;
      status: "active" | "paid" | "overdue" | "partial";
    }) => data,
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .update(debts)
      .set({
        name: data.name,
        amount: data.amount,
        original_amount: data.original_amount,
        creditor: data.creditor,
        notes: data.notes,
        status: data.status,
        updated_at: new Date(),
      })
      .where(eq(debts.id, data.id))
      .returning();
    if (!row) throw new Error("No data returned");
    return row;
  },
);

export const deleteDebtFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(debts).where(eq(debts.id, data.id));
    return { success: true };
  },
);
