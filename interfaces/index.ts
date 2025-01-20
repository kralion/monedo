export interface IExpense {
  description: string;
  id: number;
  amount: number;
  number: number;
  user_id: string;
  date: Date | string;
  id_category: number;
  categories?: ICategory;
  periodicity: boolean;
  currency: string;
}

export interface IBudget {
  id?: number;
  user_id: string;
  created_At: Date;
  description: string;
  amount: number;
}

export interface IUser {
  id: number;
  nombre: string;
  correo: string;
  password: string;
}

export interface ICategory {
  id: number;
  created_at: Date;
  label: string;
  color: string;
  user_id: string;
}

export interface INotification {
  id: number;
  title: string;
  description: string;
  type: "info" | "warning" | "error";
  user_id?: string;
  created_at: Date;
}

export interface IGoal {
  id?: string;
  presupuesto_id: string;
  ahorro_actual: number;
  meta_ahorro: number;
}
export interface BudgetStore {
  budgets: IBudget[];
  budget: IBudget | null;
  isOutOfBudget: boolean;
  loading: boolean;
  checkBudget: (userId: string) => void;
  totalBudget: number;
  addBudget: (budget: IBudget) => Promise<void>;
  updateBudget: (budget: IBudget) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  getBudgets: (userId: string) => Promise<void>;
  getTotalBudget: (userId: string) => Promise<number>;
  getBudgetById: (id: number) => Promise<IBudget>;
}
export interface ExpenseStore {
  addExpense: (expense: IExpense) => void;
  totalExpenses: number;
  deleteExpense: (id: number) => void;
  weeklyExpenses: IExpense[];
  loading: boolean;
  expense: IExpense | null;
  expenses: IExpense[];
  getExpenseById: (id: number) => Promise<IExpense>;
  updateExpense: (expense: IExpense) => void;
  sumOfAllOfExpenses: (userId: string) => Promise<number>;
  getExpensesByPeriodicity: ({
    startTimeOfQuery,
    endTimeOfQuery,
  }: {
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  }) => Promise<IExpense[] | null>;
  getRecentExpenses: (userId: string) => Promise<IExpense[]>;
}
export interface CategoryStore {
  categories: ICategory[];
  category: ICategory | null;
  loading: boolean;

  addCategory: (category: ICategory) => Promise<void>;
  updateCategory: (category: ICategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  getCategories: () => Promise<void>;
}
export interface NotificationStore {
  notifications: INotification[];
  loading: boolean;

  addNotification: (notification: INotification) => Promise<void>;
  getNotifications: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}
export interface IBudgetContextProvider {
  addBudget: (budget: IBudget) => void;
  getTotalBudget: () => Promise<number>;
  loading: boolean;
  budgets: IBudget[];
  getBudgetById: (id: number) => Promise<IBudget>;
  setBudget: (budget: IBudget) => void;
  budget: IBudget;
  getCurrentBudget: () => Promise<IBudget | null>;
  updateBudget: (budget: IBudget) => void;
  deleteBudget: (id: number) => void;
  getBudgets: () => Promise<IBudget[] | null>;
}

export interface IExpenseContextProvider {
  addExpense: (expense: IExpense) => void;
  getWeeklyExpenses: () => Promise<IExpense[]>;
  isOutOfBudget: boolean;
  deleteExpense: (id: number) => void;
  checkBudget: () => void;
  weeklyExpenses: IExpense[];
  loading: boolean;
  expense: IExpense;
  expenses: IExpense[];
  getExpenseById: (id: number) => Promise<IExpense>;
  updateExpense: (expense: IExpense) => void;
  sumOfAllOfExpensesMonthly: () => Promise<number>;
  getExpensesByPeriodicity: (params: {
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
