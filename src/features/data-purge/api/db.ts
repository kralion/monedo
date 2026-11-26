import { db } from "@/db";
import { expenses, incomes } from "@/schema";
import { and, count, eq, lt, sql } from "drizzle-orm";
import type { PurgeInput, PurgePreview, PurgeResult } from "./types";

/**
 * Cutoff used to determine "old" data.
 * Defaults to 30 days; change PURGE_OLDER_THAN_DAYS to adjust.
 */
export const PURGE_OLDER_THAN_DAYS = 30;

/**
 * ISO string cutoff — used for expenses (date stored as text).
 */
export const cutoffDateIso = (olderThanDays = PURGE_OLDER_THAN_DAYS): string =>
  new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();

/**
 * Date object cutoff — used for incomes (created_at is a real timestamp column).
 */
export const cutoffDate = (olderThanDays = PURGE_OLDER_THAN_DAYS): Date =>
  new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

export const countOldExpenses = async (
  userId: string,
  olderThanDays = PURGE_OLDER_THAN_DAYS,
): Promise<number> => {
  const cutoff = cutoffDateIso(olderThanDays);
  const [row] = await db
    .select({ count: count() })
    .from(expenses)
    .where(
      and(eq(expenses.user_id, userId), lt(expenses.date, cutoff)),
    );
  return Number(row?.count ?? 0);
};

export const countOldIncomes = async (
  userId: string,
  olderThanDays = PURGE_OLDER_THAN_DAYS,
): Promise<number> => {
  const cutoff = cutoffDate(olderThanDays);
  const [row] = await db
    .select({ count: count() })
    .from(incomes)
    .where(and(eq(incomes.user_id, userId), lt(incomes.created_at, cutoff)));
  return Number(row?.count ?? 0);
};

/**
 * Calls the Neon RPC that performs the actual purge.
 * Function: purge_old_transactions(p_user_id, p_type, p_older_than_days)
 * Defined in src/types/public.types.ts
 */
export type PurgeRpcInput = {
  userId: string;
  type: "expenses" | "incomes" | "both";
  olderThanDays: number;
};

export type PurgeRpcOutput = {
  purged_expenses?: number;
  purged_incomes?: number;
  success?: boolean;
};

const PURGE_RPC_FUNCTION = "purge_old_transactions";

export const callPurgeRpc = async (input: PurgeRpcInput): Promise<PurgeRpcOutput> => {
  const { userId, type, olderThanDays } = input;

  try {
    const result = await db.execute(sql`
      SELECT ${sql.raw(PURGE_RPC_FUNCTION)}(
        ${userId}::text,
        ${type}::text,
        ${olderThanDays}::int
      );
    `);
    return result.rows?.[0] ?? {};
  } catch (error) {
    throw new Error(
      `RPC "${PURGE_RPC_FUNCTION}" call failed. Underlying: ${(error as Error)?.message ?? error}`,
    );
  }
};

// Re-export types so consumers can import from db.ts
export type { PurgeInput, PurgePreview, PurgeResult };
