export interface IExpensePOST {
  description: string;
  amount: number;
  category: {
    label: string;
    value: string;
  };
  periodicity: boolean;
  currency: string;
}
export interface IExpense {
  description: string;
  id: string;
  amount: number;
  number: number;
  date: Date | string;
  category: string;
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
  loading: boolean;
  budgets: IBudget[];
  getBudgetById: (id: string) => Promise<IBudget>;
  budget: IBudget;
  getMonthlyBudget: () => Promise<number>;
  updateBudget: (budget: IBudget) => void;
  deleteBudget: (id: string) => void;
  getBudgets: (id: string) => Promise<IBudget[] | null>;
}

export interface IExpenseContextProvider {
  addExpense: (expense: IExpense) => void;
  getWeeklyExpenses: () => Promise<IExpense[]>;
  deleteExpense: (id: string) => void;
  loading: boolean;
  expense: IExpense;
  expenses: IExpense[];
  getExpenseById: (id: string) => Promise<IExpense>;
  updateExpense: (expense: IExpense) => void;
  getExpensesByUser: (id: string) => Promise<IExpense[]>;
  sumOfAllOfExpensesMonthly: () => Promise<number>;
  getTopExpenses: ({
    startTimeOfQuery,
    endTimeOfQuery,
  }: {
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  }) => Promise<IExpense[] | null>;
  getRecentExpenses: () => Promise<IExpense[]>;
  getExpensesByPeriodicity: () => Promise<IExpense[]>;
}
export interface IGoalContextProvider {
  addGoal: (meta: IGoal) => void;
  goals: IGoal[];
  updateGoal: (meta: IGoal) => void;
  getRecentGoals: () => Promise<IGoal[]>;
}
