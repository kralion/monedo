export type TransactionType = "todos" | "ingresos" | "gastos";

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

export interface IIncome {
  id?: number;
  user_id: string;
  created_at: Date;
  description: string;
  amount: number;
  id_debt?: number | null;
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
export interface IncomeStore {
  incomes: IIncome[];
  income: IIncome | null;
  loading: boolean;
  totalIncome: number;
  addIncome: (income: IIncome) => Promise<void>;
  updateIncome: (income: IIncome) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
  getIncomes: (userId: string) => Promise<void>;
  getIncomesSortedByAmount: (userId: string) => Promise<IIncome[]>;
  getTotalIncome: (userId: string) => Promise<number>;
  getIncomeById: (id: number) => Promise<IIncome>;
}
export interface ExpenseStore {
  addExpense: (expense: IExpense) => void;
  totalExpenses: number;
  deleteExpense: (id: number) => void;
  getExpensesByCategory: (categoryId: number) => Promise<IExpense[]>;
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
  getAllExpensesSortedByAmount: (userId: string) => Promise<IExpense[]>;
  getRecentExpenses: (userId: string) => Promise<IExpense[]>;
}
export interface CategoryStore {
  categories: ICategory[];
  getCategoryById: (id: number) => Promise<ICategory>;
  category: ICategory;
  loading: boolean;
  addCategory: (category: ICategory) => Promise<void>;
  updateCategory: (category: ICategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  getCategories: (userId: string) => Promise<void>;
}

export interface IIncomeContextProvider {
  addIncome: (income: IIncome) => void;
  getTotalIncome: () => Promise<number>;
  loading: boolean;
  incomes: IIncome[];
  getIncomeById: (id: number) => Promise<IIncome>;
  setIncome: (income: IIncome) => void;
  income: IIncome;
  getCurrentIncome: () => Promise<IIncome | null>;
  updateIncome: (income: IIncome) => void;
  deleteIncome: (id: number) => void;
  getIncomes: () => Promise<IIncome[] | null>;
}

export interface IExpenseContextProvider {
  addExpense: (expense: IExpense) => void;
  getWeeklyExpenses: () => Promise<IExpense[]>;
  deleteExpense: (id: number) => void;
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

export interface IDebt {
  id: number;
  user_id: string;
  name: string;
  amount: number;
  original_amount?: number | null;
  creditor?: string | null;
  notes?: string | null;
  due_date?: string | null;
  status: "active" | "paid" | "overdue" | "partial";
  created_at: Date;
  updated_at?: Date | null;
}

export interface DebtStore {
  debts: IDebt[];
  debt: IDebt | null;
  loading: boolean;
  getDebts: (userId: string) => Promise<void>;
  getDebtById: (id: number) => Promise<IDebt>;
  addDebt: (debt: IDebt) => Promise<void>;
  updateDebt: (debt: IDebt) => Promise<void>;
  deleteDebt: (id: number) => Promise<void>;
}
