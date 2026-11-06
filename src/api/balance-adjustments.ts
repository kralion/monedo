import { db } from "@/db";
import { balanceAdjustments } from "@/schema";
import { eq } from "drizzle-orm";

export const getBalanceAdjustment = async (userId: string) => {
  const [row] = await db
    .select()
    .from(balanceAdjustments)
    .where(eq(balanceAdjustments.user_id, userId))
    .orderBy(balanceAdjustments.created_at)
    .limit(1);
  if (!row) return 0;
  return Number(row.amount as unknown as string);
};

export type SetBalanceAdjustmentInput = {
  user_id: string;
  amount: string;
  description?: string | null;
};

export const setBalanceAdjustment = async ({
  user_id,
  amount,
  description,
}: SetBalanceAdjustmentInput) => {
  const [existing] = await db
    .select()
    .from(balanceAdjustments)
    .where(eq(balanceAdjustments.user_id, user_id))
    .limit(1);

  if (existing) {
    const [row] = await db
      .update(balanceAdjustments)
      .set({ amount, description, updated_at: new Date() })
      .where(eq(balanceAdjustments.id, existing.id))
      .returning();
    return { ...row, amount: Number(row.amount as unknown as string) };
  } else {
    const [row] = await db
      .insert(balanceAdjustments)
      .values({ user_id, amount, description })
      .returning();
    return { ...row, amount: Number(row.amount as unknown as string) };
  }
};

export const clearBalanceAdjustment = async (userId: string) => {
  await db.delete(balanceAdjustments).where(eq(balanceAdjustments.user_id, userId));
  return { success: true };
};