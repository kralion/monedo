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
  isOutOfBudget: false,

  addExpense: async (expense: IExpense) => {
    set({ loading: true });
    const { error } = await supabase.from("expenses").insert(expense);
    if (error) {
      toast.error("Ocurrió un error al registrar el gasto");
      console.log(error);
    } else {
      toast.success("Gasto registrado exitosamente");
      router.push("/(auth)/(tabs)");
    }
    set({ loading: false });
  },

  updateExpense: async (expense: IExpense) => {
    set({ loading: true });
    const { error } = await supabase
      .from("expenses")
      .update(expense)
      .eq("id", expense.id);
    if (error) {
      toast.error("Ocurrió un error al actualizar el gasto");
    } else {
      toast.success("Gasto actualizado exitosamente");
      router.back();
    }
    set({ loading: false });
  },

  deleteExpense: async (id: string) => {
    set({ loading: true });
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      throw error;
    }
    toast.success("Gasto eliminado exitosamente");
    router.push("/(auth)/(tabs)");
    set({ loading: false });
  },
  getExpenseById: async (id: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    set({ expense: data, loading: false });
    return data;
  },

  getRecentExpenses: async (userId: string) => {
    set({ loading: true });
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(20);
    const expensesData = data ?? [];
    set({ expenses: expensesData, loading: false });
    return expensesData;
  },

  getExpensesByPeriodicity: async ({ startTimeOfQuery, endTimeOfQuery }) => {
    set({ loading: true });
    try {
      const { data } = await supabase
        .from("expenses")
        .select("*")
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

  sumOfAllOfExpenses: async () => {
    const { data } = await supabase.from("expenses").select("amount");
    if (data) {
      return data.reduce((total, expense) => total + Number(expense.amount), 0);
    }
    return 0;
  },

  checkBudget: async () => {
    const budget = 1000;
    const total = await get().sumOfAllOfExpenses();
    const isOutOfBudget = budget - total <= 0;
    set({ isOutOfBudget });

    if (isOutOfBudget) {
      await supabase.from("notifications").insert({
        title: "¡No tienes fondos suficientes!",
        description:
          "No puedes registrar más gastos, debes ingresar un monto menor a tu presupuesto",
        type: "warning",
      });
    }
  },
}));
