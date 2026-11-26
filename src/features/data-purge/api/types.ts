export type PurgeType = "expenses" | "incomes" | "both";

export interface PurgeInput {
  userId: string;
  type: PurgeType;
  olderThanDays: number;
}

export interface PurgeResult {
  purgedExpenses: number;
  purgedIncomes: number;
  totalPurged: number;
  success: boolean;
}

export interface PurgePreview {
  expenseCount: number;
  incomeCount: number;
  totalCount: number;
  olderThanDays: number;
}
