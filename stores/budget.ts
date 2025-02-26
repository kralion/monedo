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
    // Generate a temporary ID for optimistic update
    const tempBudget = { ...budget, id: Date.now() };

    // Optimistically update the UI
    set((state) => ({
      budgets: [...state.budgets, tempBudget],
      loading: true,
    }));

    // Attempt to save to the backend
    const { data, error } = await supabase
      .from("budgets")
      .insert(budget)
      .select()
      .single();

    if (error) {
      // Revert optimistic update on error
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== tempBudget.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar el presupuesto");
      return;
    }

    // Update with the real data from the server
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === tempBudget.id ? data : b)),
      loading: false,
    }));

    // Update total budget
    get().getTotalBudget(budget.user_id);

    toast.success("Registro exitoso");
  },

  getBudgetById: async (id: number) => {
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

  getTotalBudget: async (userId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("budgets")
      .select("amount")
      .eq("user_id", userId);
    if (error) throw error;
    const total = data.reduce((sum, budget) => sum + Number(budget.amount), 0);
    set({ totalBudget: total, loading: false });
    return total;
  },

  updateBudget: async (budget: IBudget) => {
    // Store the original budgets for rollback if needed
    const originalBudgets = [...get().budgets];
    const originalBudget = get().budget;

    // Optimistically update the UI
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
      budget:
        budget.id === (originalBudget?.id || -1) ? budget : originalBudget,
      loading: true,
    }));

    // Attempt to update in the backend
    const { data, error } = await supabase
      .from("budgets")
      .update(budget)
      .eq("id", budget.id)
      .select()
      .single();

    if (error) {
      // Revert optimistic update on error
      set({
        budgets: originalBudgets,
        budget: originalBudget,
        loading: false,
      });
      toast.error("Ocurrió un error al actualizar el presupuesto");
      return;
    }

    // Update with the real data from the server if available
    if (data) {
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === budget.id ? data : b)),
        budget:
          budget.id === (originalBudget?.id || -1) ? data : originalBudget,
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    // Update total budget
    get().getTotalBudget(budget.user_id);

    toast.success("Billetera actualizada");
    router.back();
  },

  deleteBudget: async (id: number) => {
    // Store the original budgets for rollback if needed
    const originalBudgets = [...get().budgets];
    const deletedBudget = get().budgets.find((b) => b.id === id);

    // Optimistically update the UI
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
      loading: true,
    }));

    // Attempt to delete from the backend
    const { error } = await supabase.from("budgets").delete().eq("id", id);

    if (error) {
      // Revert optimistic update on error
      set({
        budgets: originalBudgets,
        loading: false,
      });
      toast.error("Error al eliminar ingreso");
      return;
    }

    // Update total budget if we have user_id
    if (deletedBudget && deletedBudget.user_id) {
      get().getTotalBudget(deletedBudget.user_id);
    }

    set({ loading: false });
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
    const total = await expenseStore.sumOfAllOfExpenses(userId);
    if (budget - total <= 0) {
      set({ isOutOfBudget: true });
    } else {
      set({ isOutOfBudget: false });
    }
  },
}));
