import { ExpenseStore, IExpense } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  weeklyExpenses: [],
  expense: null,
  loading: false,
  totalExpenses: 0,
  addExpense: async (expense: IExpense) => {
    set({ loading: true });
    set((state) => ({
      expenses: [...state.expenses, { ...expense, id: Date.now() }],
    }));

    const { error } = await supabase.from("expenses").insert(expense);
    if (error) {
      toast.error("Ocurrió un error al registrar el gasto");
      console.log(error);
      await get().getRecentExpenses(expense.user_id);
    }
    toast.success("Gasto registrado");
    set({ loading: false });
  },

  getExpensesByCategory: async (categoryId: number) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("expenses")
      .select("*, categories:id_category(*)")
      .eq("id_category", categoryId);
    if (error) throw error;
    return data;
  },

  updateExpense: async (expense: IExpense) => {
    set({ loading: true });
    const { error } = await supabase
      .from("expenses")
      .update(expense)
      .eq("id", expense.id);
    if (error) {
      toast.error("Ocurrió un error al actualizar el gasto");
      console.log(error);
      await get().getRecentExpenses(expense.user_id);
    } else {
      toast.success("Gasto actualizado exitosamente");
      router.back();
    }
    set({ loading: false });
  },

  deleteExpense: async (id: number) => {
    set({ loading: true });
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));

    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      console.error("Error deleting expense:", error);
      const currentUserId = get().expenses.find((e) => e.id === id)?.user_id;
      await get().getRecentExpenses(currentUserId as string);
      return;
    }

    toast.success("Gasto eliminado exitosamente");
    router.back();
    set({ loading: false });
  },

  getExpenseById: async (id: number) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("expenses")
      .select("*, categories:id_category(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    set({ expense: data, loading: false });
    return data;
  },

  getRecentExpenses: async (userId: string) => {
    const { data } = await supabase
      .from("expenses")
      .select("*, categories:id_category(*)")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(20);

    const expensesData = data ?? [];
    set({ expenses: expensesData });
    return expensesData;
  },

  getExpensesByPeriodicity: async ({ startTimeOfQuery, endTimeOfQuery }) => {
    set({ loading: true });
    try {
      const { data } = await supabase
        .from("expenses")
        .select("*, categories:id_category(*)")
        .gte("date", startTimeOfQuery.toISOString())
        .lte("date", endTimeOfQuery.toISOString())
        .order("amount", { ascending: false })
        .limit(15);

      set({ loading: false });
      return data ?? [];
    } catch (error) {
      console.log("ERROR in getExpensesByPeriodicity", error);
      set({ loading: false });
      return [];
    }
  },

  sumOfAllOfExpenses: async (userId: string) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching expenses:", error);
      set({ loading: false });
      return 0;
    }

    const totalExpenses = data.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    set({ totalExpenses, loading: false });

    return totalExpenses;
  },
}));
