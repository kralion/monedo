import {
  countOldExpenses,
  countOldIncomes,
  PURGE_OLDER_THAN_DAYS,
  callPurgeRpc,
  type PurgeInput,
  type PurgePreview,
  type PurgeResult,
  type PurgeRpcOutput,
} from "./db";

export const getPurgePreview = async (
  userId: string,
  type: PurgeInput["type"],
  olderThanDays = PURGE_OLDER_THAN_DAYS,
): Promise<PurgePreview> => {
  let expenseCount = 0;
  let incomeCount = 0;

  if (type === "expenses" || type === "both") {
    expenseCount = await countOldExpenses(userId, olderThanDays);
  }
  if (type === "incomes" || type === "both") {
    incomeCount = await countOldIncomes(userId, olderThanDays);
  }

  return {
    expenseCount,
    incomeCount,
    totalCount: expenseCount + incomeCount,
    olderThanDays,
  };
};

export const executePurge = async (
  input: PurgeInput,
): Promise<PurgeResult> => {
  const rpcOutput: PurgeRpcOutput = await callPurgeRpc({
    userId: input.userId,
    type: input.type,
    olderThanDays: input.olderThanDays,
  });

  return {
    purgedExpenses: Number(rpcOutput.purged_expenses ?? 0),
    purgedIncomes: Number(rpcOutput.purged_incomes ?? 0),
    totalPurged:
      Number(rpcOutput.purged_expenses ?? 0) +
      Number(rpcOutput.purged_incomes ?? 0),
    success: Boolean(rpcOutput.success),
  };
};

export type { PurgeInput, PurgePreview, PurgeResult };
