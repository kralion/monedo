import { BudgetStore, IBudget } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { db } from "@/db";
import { budgets } from "@/schema";
import { eq } from "drizzle-orm";
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

    try {
      const [data] = await db
        .insert(budgets)
        .values({
          amount: budget.amount,
          description: budget.description,
          user_id: budget.user_id,
        })
        .returning();

      if (!data) throw new Error("No data returned");

      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === tempBudget.id ? (data as unknown as IBudget) : b,
        ),
        loading: false,
      }));

      get().getTotalBudget(budget.user_id);
      toast.success("Registro exitoso");
    } catch (error) {
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== tempBudget.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar el presupuesto");
    }
  },

  getBudgetById: async (id: number) => {
    set({ loading: true });
    try {
      const [data] = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, id));

      if (!data) throw new Error("Budget not found");

      set({ budget: data as unknown as IBudget, loading: false });
      return data as unknown as IBudget;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getTotalBudget: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await db
        .select({ amount: budgets.amount })
        .from(budgets)
        .where(eq(budgets.user_id, userId));

      const total = data.reduce((sum, budget) => sum + Number(budget.amount), 0);
      set({ totalBudget: total, loading: false });
      return total;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateBudget: async (budget: IBudget) => {
    const originalBudgets = [...get().budgets];
    const originalBudget = get().budget;

    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
      budget: budget.id === (originalBudget?.id || -1) ? budget : originalBudget,
      loading: true,
    }));

    try {
      const [data] = await db
        .update(budgets)
        .set({
          amount: budget.amount,
          description: budget.description,
        })
        .where(eq(budgets.id, budget.id!))
        .returning();

      if (data) {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === budget.id ? (data as unknown as IBudget) : b,
          ),
          budget:
            budget.id === (originalBudget?.id || -1)
              ? (data as unknown as IBudget)
              : originalBudget,
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

      get().getTotalBudget(budget.user_id);
      toast.success("Billetera actualizada");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({ budgets: originalBudgets, budget: originalBudget, loading: false });
      toast.error("Ocurrió un error al actualizar el presupuesto");
    }
  },

  deleteBudget: async (id: number) => {
    const originalBudgets = [...get().budgets];
    const deletedBudget = get().budgets.find((b) => b.id === id);

    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
      loading: true,
    }));

    try {
      await db.delete(budgets).where(eq(budgets.id, id));

      if (deletedBudget?.user_id) {
        get().getTotalBudget(deletedBudget.user_id);
      }

      set({ loading: false });
      toast.success("Eliminado exitosamente");
    } catch (error) {
      set({ budgets: originalBudgets, loading: false });
      toast.error("Error al eliminar ingreso");
    }
  },

  getBudgets: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await db
        .select()
        .from(budgets)
        .where(eq(budgets.user_id, userId));

      set({ budgets: (data as unknown as IBudget[]) ?? [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  checkBudget: async (userId: string) => {
    const budget = get().totalBudget;
    const expenseStore = useExpenseStore.getState();
    const total = await expenseStore.sumOfAllOfExpenses(userId);
    set({ isOutOfBudget: budget - total <= 0 });
  },
}));
