export interface IExpense {
  id?: string;
  fecha: Date;
  descripcion?: string;
  usuario_id?: string;
  periodicidad?: boolean;
  numeroGasto: number;
  categoria: string;
  monto: number;
  assetIdentificador?: string;
}
export interface IGoal {
  id?: string;
  presupuesto_id: string;
  ahorro_actual: number;
  meta_ahorro: number;
}
export interface IBudget {
  id?: string;
  usuario_id: string;
  fecha_registro: Date;
  fecha_final: Date;
  descripcion?: string;
  monto: number;
}

export interface IBudgetContextProvider {
  addBudget: (budget: IBudget) => void;
  budgets: IBudget[];
  updateBudget: (budget: IBudget) => void;
  deleteBudget: (id: string) => void;
  getRecentBudgets: (id: string) => Promise<IBudget[]>;
}

export interface IExpenseContextProvider {
  addExpense: (expense: IExpense) => void;
  deleteExpense: (id: string) => void;
  expense: IExpense;
  expenses: IExpense[];
  getExpenseById: (id: string) => Promise<IExpense>;
  updateExpense: (expense: IExpense) => void;
  getExpensesByUser: (id: string) => Promise<IExpense[]>;
  sumOfAllOfExpensesMonthly: () => Promise<number>;
  getTopExpenses: () => Promise<IExpense[]>;
  getRecentExpenses: () => Promise<IExpense[]>;
  getExpensesByPeriodicity: () => Promise<IExpense[]>;
}
export interface IGoalContextProvider {
  addGoal: (meta: IGoal) => void;
  goals: IGoal[];
  updateGoal: (meta: IGoal) => void;
  getRecentGoals: () => Promise<IGoal[]>;
}
