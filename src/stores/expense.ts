import { ExpenseStore, IExpense } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { db } from "@/db";
import { expenses, categories } from "@/schema";
import { eq, gte, lte, desc, and } from "drizzle-orm";

const formatExpenseDate = (expense: Partial<IExpense>): string => {
  if (!expense.date) return new Date().toISOString();
  if (typeof expense.date === "string") return expense.date;
  if (expense.date instanceof Date) return expense.date.toISOString();
  return new Date().toISOString();
};

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  weeklyExpenses: [],
  expense: null,
  loading: false,
  totalExpenses: 0,
  addExpense: async (expense: IExpense) => {
    const timestamp = Date.now();
    const formattedExpense = { ...expense, date: formatExpenseDate(expense) };
    const tempExpense = { ...formattedExpense, id: timestamp };

    set((state) => ({
      expenses: [tempExpense, ...state.expenses],
      loading: true,
    }));

    try {
      const [data] = await db
        .insert(expenses)
        .values({
          amount: formattedExpense.amount,
          currency: formattedExpense.currency,
          date: formattedExpense.date,
          description: formattedExpense.description,
          id_category: formattedExpense.id_category,
          number: formattedExpense.number,
          periodicity: formattedExpense.periodicity,
          user_id: formattedExpense.user_id,
        })
        .returning();

      if (!data) throw new Error("No data returned");

      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === timestamp ? (data as unknown as IExpense) : e,
        ),
        loading: false,
      }));

      toast.success("Gasto registrado");
      await get().getRecentExpenses(expense.user_id);
    } catch (error) {
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== timestamp),
        loading: false,
      }));
      console.error("Error adding expense:", error);
      toast.error("Ocurrió un error al registrar el gasto");
    }
  },

  updateExpense: async (expense: IExpense) => {
    const originalExpenses = [...get().expenses];
    const originalExpense = get().expense;
    const formattedExpense = { ...expense, date: formatExpenseDate(expense) };

    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === expense.id ? formattedExpense : e,
      ),
      expense: formattedExpense,
      loading: true,
    }));

    try {
      const [data] = await db
        .update(expenses)
        .set({
          amount: formattedExpense.amount,
          currency: formattedExpense.currency,
          date: formattedExpense.date,
          description: formattedExpense.description,
          id_category: formattedExpense.id_category,
          number: formattedExpense.number,
          periodicity: formattedExpense.periodicity,
        })
        .where(eq(expenses.id, expense.id))
        .returning();

      if (!data) throw new Error("No data returned");

      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === expense.id ? (data as unknown as IExpense) : e,
        ),
        expense: data as unknown as IExpense,
        loading: false,
      }));

      await get().getRecentExpenses(expense.user_id);
    } catch (error) {
      set({
        expenses: originalExpenses,
        expense: originalExpense,
        loading: false,
      });
      console.error("Error updating expense:", error);
      toast.error("Ocurrió un error al actualizar el gasto");
    }
  },

  deleteExpense: async (id: number) => {
    const originalExpenses = [...get().expenses];
    const deletedExpense = get().expenses.find((e) => e.id === id);

    if (!deletedExpense) {
      toast.error("No se encontró el gasto a eliminar");
      return;
    }

    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
      loading: true,
    }));

    try {
      await db.delete(expenses).where(eq(expenses.id, id));

      set({ loading: false });
      toast.success("Gasto eliminado exitosamente");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({ expenses: originalExpenses, loading: false });
      console.error("Error deleting expense:", error);
      toast.error("Ocurrió un error al eliminar el gasto");
    }
  },

  getExpenseById: async (id: number) => {
    set({ loading: true });
    try {
      const [data] = await db
        .select({
          id: expenses.id,
          amount: expenses.amount,
          currency: expenses.currency,
          date: expenses.date,
          description: expenses.description,
          id_category: expenses.id_category,
          number: expenses.number,
          periodicity: expenses.periodicity,
          user_id: expenses.user_id,
          categories: categories,
        })
        .from(expenses)
        .leftJoin(categories, eq(expenses.id_category, categories.id))
        .where(eq(expenses.id, id));

      if (!data) throw new Error("Expense not found");

      set({ expense: data as unknown as IExpense, loading: false });
      return data as unknown as IExpense;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching expense:", error);
      toast.error("Error al obtener el gasto");
      throw error;
    }
  },

  getExpensesByCategory: async (categoryId: number) => {
    set({ loading: true });
    try {
      const data = await db
        .select({
          id: expenses.id,
          amount: expenses.amount,
          currency: expenses.currency,
          date: expenses.date,
          description: expenses.description,
          id_category: expenses.id_category,
          number: expenses.number,
          periodicity: expenses.periodicity,
          user_id: expenses.user_id,
          categories: categories,
        })
        .from(expenses)
        .leftJoin(categories, eq(expenses.id_category, categories.id))
        .where(eq(expenses.id_category, categoryId));

      set({ loading: false });
      return data as unknown as IExpense[];
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching expenses by category:", error);
      toast.error("Error al obtener los gastos por categoría");
      return [];
    }
  },

  getRecentExpenses: async (userId: string) => {
    try {
      const data = await db
        .select({
          id: expenses.id,
          amount: expenses.amount,
          currency: expenses.currency,
          date: expenses.date,
          description: expenses.description,
          id_category: expenses.id_category,
          number: expenses.number,
          periodicity: expenses.periodicity,
          user_id: expenses.user_id,
          categories: categories,
        })
        .from(expenses)
        .leftJoin(categories, eq(expenses.id_category, categories.id))
        .where(eq(expenses.user_id, userId))
        .orderBy(desc(expenses.date))
        .limit(20);

      const expensesData = (data as unknown as IExpense[]) ?? [];
      set({ expenses: expensesData });
      return expensesData;
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
      toast.error("Error al obtener los gastos recientes");
      return [];
    }
  },

  getExpensesByPeriodicity: async ({ startTimeOfQuery, endTimeOfQuery }) => {
    set({ loading: true });
    try {
      const data = await db
        .select({
          id: expenses.id,
          amount: expenses.amount,
          currency: expenses.currency,
          date: expenses.date,
          description: expenses.description,
          id_category: expenses.id_category,
          number: expenses.number,
          periodicity: expenses.periodicity,
          user_id: expenses.user_id,
          categories: categories,
        })
        .from(expenses)
        .leftJoin(categories, eq(expenses.id_category, categories.id))
        .where(
          and(
            gte(expenses.date, startTimeOfQuery.toISOString()),
            lte(expenses.date, endTimeOfQuery.toISOString()),
          ),
        )
        .orderBy(desc(expenses.amount))
        .limit(15);

      const expensesData = (data as unknown as IExpense[]) ?? [];
      set({ weeklyExpenses: expensesData, loading: false });
      return expensesData;
    } catch (error) {
      set({ loading: false });
      toast.error("Error al obtener los gastos por periodo");
      return null;
    }
  },

  sumOfAllOfExpenses: async (userId: string) => {
    try {
      const data = await db
        .select({ amount: expenses.amount })
        .from(expenses)
        .where(eq(expenses.user_id, userId));

      const total =
        data?.reduce((sum, expense) => sum + Number(expense.amount), 0) ?? 0;

      set({ totalExpenses: total });
      return total;
    } catch (error) {
      console.error("Error calculating sum of expenses:", error);
      toast.error("Error al calcular el total de gastos");
      return 0;
    }
  },
}));
