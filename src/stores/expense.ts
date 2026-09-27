import { ExpenseStore, IExpense } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import {
  addExpense,
  deleteExpense,
  getAllExpensesSortedByAmount,
  getExpenseById,
  getExpensesByCategory,
  getExpensesByPeriodicity,
  getExpensesPaginated,
  getRecentExpenses,
  getTotalExpenses,
  updateExpense,
} from "@/api/expenses";

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
      const data = await addExpense({
        amount: String(formattedExpense.amount),
        currency: formattedExpense.currency,
        date: formattedExpense.date,
        description: formattedExpense.description,
        id_category: formattedExpense.id_category,
        number: formattedExpense.number,
        periodicity: formattedExpense.periodicity,
        user_id: formattedExpense.user_id,
      });

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
      const data = await updateExpense({
        id: expense.id,
        amount: String(formattedExpense.amount),
        currency: formattedExpense.currency,
        date: formattedExpense.date,
        description: formattedExpense.description,
        id_category: formattedExpense.id_category,
        number: formattedExpense.number,
        periodicity: formattedExpense.periodicity,
      });

      const normalized = data as unknown as IExpense;
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === expense.id ? normalized : e)),
        expense: normalized,
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
      await deleteExpense(id);

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
      const data = await getExpenseById(id);
      const normalized = data as unknown as IExpense;
      set({ expense: normalized, loading: false });
      return normalized;
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
      const data = await getExpensesByCategory(categoryId);
      const normalized = (data as unknown as IExpense[]).map((e) => ({
        ...e,
        amount: Number(e.amount as unknown as string),
      }));
      set({ loading: false });
      return normalized;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching expenses by category:", error);
      toast.error("Error al obtener los gastos por categoría");
      return [];
    }
  },

  getRecentExpenses: async (userId: string) => {
    try {
      const data = await getRecentExpenses(userId);
      const expensesData = (data as unknown as IExpense[]).map((e) => ({
        ...e,
        amount: Number(e.amount as unknown as string),
      }));
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
      const data = await getExpensesByPeriodicity({
        startTimeOfQuery: startTimeOfQuery.toISOString(),
        endTimeOfQuery: endTimeOfQuery.toISOString(),
      });
      const expensesData = (data as unknown as IExpense[]).map((e) => ({
        ...e,
        amount: Number(e.amount as unknown as string),
      }));
      set({ weeklyExpenses: expensesData, loading: false });
      return expensesData;
    } catch (error) {
      set({ loading: false });
      toast.error("Error al obtener los gastos por periodo");
      return null;
    }
  },

  getAllExpensesSortedByAmount: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await getAllExpensesSortedByAmount(userId);
      const expensesData = (data as unknown as IExpense[]).map((e) => ({
        ...e,
        amount: Number(e.amount as unknown as string),
      }));
      set({ expenses: expensesData, loading: false });
      return expensesData;
    } catch (error) {
      set({ loading: false });
      toast.error("Error al obtener los gastos");
      return [];
    }
  },

  sumOfAllOfExpenses: async (userId: string) => {
    try {
      const total = await getTotalExpenses(userId);
      set({ totalExpenses: total });
      return total;
    } catch (error) {
      console.error("Error calculating sum of expenses:", error);
      toast.error("Error al calcular el total de gastos");
      return 0;
    }
  },

  getExpensesPaginated: async (userId: string, limit: number, offset: number) => {
    try {
      const data = await getExpensesPaginated(userId, limit, offset);
      const normalized = (data as unknown as IExpense[]).map((e) => ({
        ...e,
        amount: Number(e.amount as unknown as string),
      }));
      return normalized;
    } catch (error) {
      console.error("Error fetching paginated expenses:", error);
      toast.error("Error al obtener gastos paginados");
      return [];
    }
  },
}));
