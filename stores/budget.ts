import { BudgetStore, IBudget } from "@/interfaces";
import { toast } from "sonner";
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
    const tempBudget = { ...budget, id: Date.now() };

    set((state) => ({ budgets: [...state.budgets, tempBudget], loading: true }));

    const { data, error } = await supabase
      .from("budgets")
      .insert(budget)
      .select()
      .single();

    if (error) {
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== tempBudget.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar el presupuesto");
      return;
    }

    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === tempBudget.id ? data : b)),
      loading: false,
    }));

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
    const originalBudgets = [...get().budgets];
    const originalBudget = get().budget;

    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
      budget: budget.id === (originalBudget?.id || -1) ? budget : originalBudget,
      loading: true,
    }));

    const { data, error } = await supabase
      .from("budgets")
      .update(budget)
      .eq("id", budget.id)
      .select()
      .single();

    if (error) {
      set({ budgets: originalBudgets, budget: originalBudget, loading: false });
      toast.error("Ocurrió un error al actualizar el presupuesto");
      return;
    }

    if (data) {
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === budget.id ? data : b)),
        budget: budget.id === (originalBudget?.id || -1) ? data : originalBudget,
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    get().getTotalBudget(budget.user_id);
    toast.success("Billetera actualizada");
    if (typeof window !== "undefined") window.history.back();
  },

  deleteBudget: async (id: number) => {
    const originalBudgets = [...get().budgets];
    const deletedBudget = get().budgets.find((b) => b.id === id);

    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
      loading: true,
    }));

    const { error } = await supabase.from("budgets").delete().eq("id", id);

    if (error) {
      set({ budgets: originalBudgets, loading: false });
      toast.error("Error al eliminar ingreso");
      return;
    }

    if (deletedBudget?.user_id) {
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
    set({ isOutOfBudget: budget - total <= 0 });
  },
}));
