import { ExpenseStore, IExpense } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

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

    set((state) => ({ expenses: [tempExpense, ...state.expenses], loading: true }));

    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert(formattedExpense)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === timestamp ? data : e)),
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
      expenses: state.expenses.map((e) => (e.id === expense.id ? formattedExpense : e)),
      expense: formattedExpense,
      loading: true,
    }));

    try {
      const { data, error } = await supabase
        .from("expenses")
        .update(formattedExpense)
        .eq("id", expense.id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === expense.id ? data : e)),
        expense: data,
        loading: false,
      }));

      await get().getRecentExpenses(expense.user_id);
    } catch (error) {
      set({ expenses: originalExpenses, expense: originalExpense, loading: false });
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

    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id), loading: true }));

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from("expenses")
        .select("*, categories:id_category(*)")
        .eq("id", id)
        .single();

      if (error) throw error;

      set({ expense: data, loading: false });
      return data;
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
      const { data, error } = await supabase
        .from("expenses")
        .select("*, categories:id_category(*)")
        .eq("id_category", categoryId);

      if (error) throw error;

      set({ loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching expenses by category:", error);
      toast.error("Error al obtener los gastos por categoría");
      return [];
    }
  },

  getRecentExpenses: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*, categories:id_category(*)")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(20);

      if (error) throw error;

      const expensesData = data ?? [];
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
      const { data, error } = await supabase
        .from("expenses")
        .select("*, categories:id_category(*)")
        .gte("date", startTimeOfQuery.toISOString())
        .lte("date", endTimeOfQuery.toISOString())
        .order("amount", { ascending: false })
        .limit(15);

      if (error) throw error;

      const expensesData = data ?? [];
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
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", userId);

      if (error) throw error;

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
