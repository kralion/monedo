import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db.server";
import { incomes, debts } from "@/schema";
import { eq, desc } from "drizzle-orm";

export const getIncomesFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const rows = await db.select().from(incomes).where(eq(incomes.user_id, data.userId));
    return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
  },
);

export const getTotalIncomeFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select({ amount: incomes.amount })
      .from(incomes)
      .where(eq(incomes.user_id, data.userId));
    return rows.reduce((sum, r) => sum + Number(r.amount), 0);
  },
);

export const getIncomeByIdFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(incomes).where(eq(incomes.id, data.id));
    if (!row) throw new Error("Income not found");
    return { ...row, amount: Number(row.amount as unknown as string) };
  },
);

export const addIncomeFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      amount: string;
      description: string;
      user_id: string;
      created_at?: string;
      id_debt?: number | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const createdAt = data.created_at ? new Date(data.created_at) : new Date();

    if (data.id_debt) {
      const [debt] = await db.select().from(debts).where(eq(debts.id, data.id_debt));
      if (!debt) throw new Error("Debt not found");
      const remaining = Number(debt.amount);

      if (Number(data.amount) <= remaining) {
        const [row] = await db
          .insert(incomes)
          .values({
            amount: data.amount,
            description: data.description,
            user_id: data.user_id,
            created_at: createdAt,
            id_debt: data.id_debt,
          })
          .returning();
        if (!row) throw new Error("No data returned");
        const newAmount = remaining - Number(data.amount);
        const newStatus = newAmount === 0 ? "paid" : debt.status;
        await db
          .update(debts)
          .set({ amount: newAmount, status: newStatus, updated_at: new Date() })
          .where(eq(debts.id, data.id_debt));
        return [{ ...row, amount: Number(row.amount as unknown as string) }];
      } else {
        const linkedAmount = remaining;
        const overflowAmount = Number(data.amount) - remaining;
        const [rowLinked] = await db
          .insert(incomes)
          .values({
            amount: String(linkedAmount),
            description: data.description,
            user_id: data.user_id,
            created_at: createdAt,
            id_debt: data.id_debt,
          })
          .returning();
        const [rowOverflow] = await db
          .insert(incomes)
          .values({
            amount: String(overflowAmount),
            description: `Sobre pago de deuda ${debt.name}`,
            user_id: data.user_id,
            created_at: createdAt,
          })
          .returning();
        await db
          .update(debts)
          .set({ amount: 0, status: "paid", updated_at: new Date() })
          .where(eq(debts.id, data.id_debt));
        return [
          rowLinked ? { ...rowLinked, amount: Number(rowLinked.amount as unknown as string) } : null,
          rowOverflow ? { ...rowOverflow, amount: Number(rowOverflow.amount as unknown as string) } : null,
        ].filter(Boolean);
      }
    } else {
      const [row] = await db
        .insert(incomes)
        .values({
          amount: data.amount,
          description: data.description,
          user_id: data.user_id,
          created_at: createdAt,
        })
        .returning();
      if (!row) throw new Error("No data returned");
      return [{ ...row, amount: Number(row.amount as unknown as string) }];
    }
  },
);

export const updateIncomeFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; amount: string; description: string }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
      .update(incomes)
      .set({ amount: data.amount, description: data.description })
      .where(eq(incomes.id, data.id))
      .returning();
    if (!row) throw new Error("No data returned");
    return { ...row, amount: Number(row.amount as unknown as string) };
  },
);

export const deleteIncomeFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [existing] = await db.select().from(incomes).where(eq(incomes.id, data.id));
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
    await db.delete(incomes).where(eq(incomes.id, data.id));
    return { success: true };
  },
);

export const getIncomesSortedByAmountFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(incomes)
      .where(eq(incomes.user_id, data.userId))
      .orderBy(desc(incomes.amount));
    return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
  },
);

export const getIncomesPaginatedFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string; limit: number; offset: number }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(incomes)
      .where(eq(incomes.user_id, data.userId))
      .orderBy(desc(incomes.created_at))
      .limit(data.limit)
      .offset(data.offset);
    return rows.map((r) => ({ ...r, amount: Number(r.amount as unknown as string) }));
  },
);
