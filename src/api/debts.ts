import { db } from "@/db";
import { debts } from "@/schema";
import { eq, desc } from "drizzle-orm";

export const getDebts = async (userId: string) => {
  return db
    .select()
    .from(debts)
    .where(eq(debts.user_id, userId))
    .orderBy(desc(debts.created_at));
};

export const getDebtById = async (id: number) => {
  const [row] = await db.select().from(debts).where(eq(debts.id, id));
  if (!row) throw new Error("Debt not found");
  return row;
};

export type AddDebtInput = {
  user_id: string;
  name: string;
  amount: number;
  original_amount?: number | null;
  creditor?: string | null;
  notes?: string | null;
  status: "active" | "paid" | "overdue" | "partial";
};

export const addDebt = async ({
  user_id,
  name,
  amount,
  original_amount,
  creditor,
  notes,
  status,
}: AddDebtInput) => {
  const [row] = await db
    .insert(debts)
    .values({
      user_id,
      name,
      amount,
      original_amount,
      creditor,
      notes,
      status,
    })
    .returning();
  if (!row) throw new Error("No data returned");
  return row;
};

export type UpdateDebtInput = {
  id: number;
  name: string;
  amount: number;
  original_amount?: number | null;
  creditor?: string | null;
  notes?: string | null;
  status: "active" | "paid" | "overdue" | "partial";
};

export const updateDebt = async ({
  id,
  name,
  amount,
  original_amount,
  creditor,
  notes,
  status,
}: UpdateDebtInput) => {
  const [row] = await db
    .update(debts)
    .set({
      name,
      amount,
      original_amount,
      creditor,
      notes,
      status,
      updated_at: new Date(),
    })
    .where(eq(debts.id, id))
    .returning();
  if (!row) throw new Error("No data returned");
  return row;
};

export const deleteDebt = async (id: number) => {
  await db.delete(debts).where(eq(debts.id, id));
  return { success: true };
};
