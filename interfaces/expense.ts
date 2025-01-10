import { ICategory } from "./category";

export interface IExpense {
  description: string;
  id: string;
  amount: number;
  number: number;
  date: Date | string;
  id_category: number;
  categories?: ICategory;
  periodicity: boolean;
  currency: string;
}
export interface IGoal {
  id?: string;
  presupuesto_id: string;
  ahorro_actual: number;
  meta_ahorro: number;
}
export interface IBudget {
  id: string;
  user_id: string;
  created_At: Date;
  description: string;
  amount: number;
}

export interface IBudgetContextProvider {
  addBudget: (budget: IBudget) => void;
  getTotalBudget: () => Promise<number>;
  loading: boolean;
  budgets: IBudget[];
  getBudgetById: (id: string) => Promise<IBudget>;
  setBudget: (budget: IBudget) => void;
  budget: IBudget;
  getCurrentBudget: () => Promise<IBudget | null>;
  updateBudget: (budget: IBudget) => void;
  deleteBudget: (id: string) => void;
  getBudgets: () => Promise<IBudget[] | null>;
}

export interface IExpenseContextProvider {
  addExpense: (expense: IExpense) => void;
  getWeeklyExpenses: () => Promise<IExpense[]>;
  isOutOfBudget: boolean;
  deleteExpense: (id: string) => void;
  checkBudget: () => void;
  weeklyExpenses: IExpense[];
  loading: boolean;
  expense: IExpense;
  expenses: IExpense[];
  getExpenseById: (id: string) => Promise<IExpense>;
  updateExpense: (expense: IExpense) => void;
  sumOfAllOfExpensesMonthly: () => Promise<number>;
  getExpensesByPeriodicity: ({
    startTimeOfQuery,
    endTimeOfQuery,
  }: {
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  }) => Promise<IExpense[] | null>;
  getRecentExpenses: () => Promise<IExpense[]>;
}
export interface IGoalContextProvider {
  addGoal: (meta: IGoal) => void;
  goals: IGoal[];
  updateGoal: (meta: IGoal) => void;
  getRecentGoals: () => Promise<IGoal[]>;
}
