import { db } from "@/db";
import { incomes, debts } from "@/schema";
import { eq, desc } from "drizzle-orm";

export const getIncomes = async (userId: string) => {
  const rows = await db.select().from(incomes).where(eq(incomes.user_id, userId));
  return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
};

export const getTotalIncome = async (userId: string) => {
  const rows = await db
    .select({ amount: incomes.amount })
    .from(incomes)
    .where(eq(incomes.user_id, userId));
  return rows.reduce((sum, r) => sum + Number(r.amount), 0);
};

export const getIncomeById = async (id: number) => {
  const [row] = await db.select().from(incomes).where(eq(incomes.id, id));
  if (!row) throw new Error("Income not found");
  return { ...row, amount: Number(row.amount as unknown as string) };
};

export type AddIncomeInput = {
  amount: string;
  description: string;
  user_id: string;
  created_at?: string;
  id_debt?: number | null;
};

export const addIncome = async ({
  amount,
  description,
  user_id,
  created_at,
  id_debt,
}: AddIncomeInput) => {
  const createdAt = created_at ? new Date(created_at) : new Date();

  if (id_debt) {
    const [debt] = await db.select().from(debts).where(eq(debts.id, id_debt));
    if (!debt) throw new Error("Debt not found");
    const remaining = Number(debt.amount);

    if (Number(amount) <= remaining) {
      const [row] = await db
        .insert(incomes)
        .values({
          amount,
          description,
          user_id,
          created_at: createdAt,
          id_debt,
        })
        .returning();
      if (!row) throw new Error("No data returned");
      const newAmount = remaining - Number(amount);
      const newStatus = newAmount === 0 ? "paid" : debt.status;
      await db
        .update(debts)
        .set({ amount: newAmount, status: newStatus, updated_at: new Date() })
        .where(eq(debts.id, id_debt));
      return [{ ...row, amount: Number(row.amount as unknown as string) }];
    } else {
      const linkedAmount = remaining;
      const overflowAmount = Number(amount) - remaining;
      const [rowLinked] = await db
        .insert(incomes)
        .values({
          amount: String(linkedAmount),
          description,
          user_id,
          created_at: createdAt,
          id_debt,
        })
        .returning();
      const [rowOverflow] = await db
        .insert(incomes)
        .values({
          amount: String(overflowAmount),
          description: `Sobre pago de deuda ${debt.name}`,
          user_id,
          created_at: createdAt,
        })
        .returning();
      await db
        .update(debts)
        .set({ amount: 0, status: "paid", updated_at: new Date() })
        .where(eq(debts.id, id_debt));
      return [
        rowLinked ? { ...rowLinked, amount: Number(rowLinked.amount as unknown as string) } : null,
        rowOverflow
          ? { ...rowOverflow, amount: Number(rowOverflow.amount as unknown as string) }
          : null,
      ].filter(Boolean);
    }
  } else {
    const [row] = await db
      .insert(incomes)
      .values({
        amount,
        description,
        user_id,
        created_at: createdAt,
      })
      .returning();
    if (!row) throw new Error("No data returned");
    return [{ ...row, amount: Number(row.amount as unknown as string) }];
  }
};

export const updateIncome = async ({
  id,
  amount,
  description,
}: {
  id: number;
  amount: string;
  description: string;
}) => {
  const [row] = await db
    .update(incomes)
    .set({ amount, description })
    .where(eq(incomes.id, id))
    .returning();
  if (!row) throw new Error("No data returned");
  return { ...row, amount: Number(row.amount as unknown as string) };
};

export const deleteIncome = async (id: number) => {
  const [existing] = await db.select().from(incomes).where(eq(incomes.id, id));
  if (existing?.id_debt) {
    const [debt] = await db.select().from(debts).where(eq(debts.id, existing.id_debt));
    if (debt) {
      const restored = Number(debt.amount) + Number(existing.amount);
      const newStatus = debt.status === "paid" ? "active" : debt.status;
      await db
        .update(debts)
        .set({ amount: restored, status: newStatus, updated_at: new Date() })
        .where(eq(debts.id, existing.id_debt));
    }
  }
  await db.delete(incomes).where(eq(incomes.id, id));
  return { success: true };
};

export const getIncomesSortedByAmount = async (userId: string) => {
  const rows = await db
    .select()
    .from(incomes)
    .where(eq(incomes.user_id, userId))
    .orderBy(desc(incomes.amount));
  return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
};

export const getIncomesPaginated = async (userId: string, limit: number, offset: number) => {
  const rows = await db
    .select()
    .from(incomes)
    .where(eq(incomes.user_id, userId))
    .orderBy(desc(incomes.created_at))
    .limit(limit)
    .offset(offset);
  return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
};
