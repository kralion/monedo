import { BudgetStore, IBudget } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { useExpenseStore } from "./expense";
export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: [],
  budget: null,
  loading: false,
  totalBudget: 0,
  isOutOfBudget: false,
  addBudget: async (budget: IBudget) => {
    set({ loading: true });
    set((state) => ({
      budgets: [...state.budgets, { ...budget, id: Date.now() }],
    }));

    const { error } = await supabase.from("budgets").insert(budget);
    if (error) {
      toast.error("Ocurrió un error al registrar el presupuesto");
      console.log(error);
      await get().getBudgets(budget.user_id);
    } else {
      toast.success("Registro exitoso");
      router.push("/(auth)/(tabs)");
    }
    set({ loading: false });
  },

  getBudgetById: async (id: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching budget by ID:", error);
      set({ loading: false });
      throw error;
    }
    set({ budget: data, loading: false });
    return data;
  },

  getTotalBudget: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("budgets").select("amount");
    if (error) throw error;
    const total = data.reduce((sum, budget) => sum + Number(budget.amount), 0);
    set({ totalBudget: total, loading: false });
    return total;
  },

  updateBudget: async (budget: IBudget) => {
    set({ loading: true });
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    }));

    const { error } = await supabase
      .from("budgets")
      .update(budget)
      .eq("id", budget.id);
    if (error) {
      toast.error("Ocurrió un error al actualizar el presupuesto");
      await get().getBudgets(budget.user_id);
    } else {
      toast.success("Billetera actualizada");
      router.back();
    }
    set({ loading: false });
  },

  deleteBudget: async (id: number) => {
    set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar ingreso");
    }
    toast.success("Eliminado exitosamente");
  },

  getBudgets: async (userId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    set({ budgets: data ?? [], loading: false });
  },
  checkBudget: async (userId: string) => {
    const budget = get().totalBudget;
    const expenseStore = useExpenseStore.getState();
    const total = await expenseStore.sumOfAllOfExpenses();

    if (budget - total <= 0) {
      set({ isOutOfBudget: true });
      await supabase.from("notifications").insert({
        title: "¡No tienes fondos suficientes!",
        description:
          "No puedes registrar más gastos, debes ingresar un monto menor a tu presupuesto",
        type: "warning",
        user_id: userId,
      });
    } else {
      set({ isOutOfBudget: false });
    }
  },
}));
