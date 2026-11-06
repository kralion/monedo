import { BalanceAdjustmentStore } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { getBalanceAdjustment, setBalanceAdjustment, clearBalanceAdjustment } from "@/api/balance-adjustments";

export const useBalanceAdjustmentStore = create<BalanceAdjustmentStore>((set) => ({
  balanceAdjustment: 0,
  loading: false,

  getBalanceAdjustment: async (userId: string) => {
    set({ loading: true });
    try {
      const adjustment = await getBalanceAdjustment(userId);
      set({ balanceAdjustment: adjustment, loading: false });
      return adjustment;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching balance adjustment:", error);
      toast.error("Error al obtener el reajuste de balance");
      return 0;
    }
  },

  setBalanceAdjustment: async (userId: string, amount: number, description?: string) => {
    if (!userId) {
      toast.error("Usuario no autenticado");
      return;
    }

    set({ loading: true });
    try {
      await setBalanceAdjustment({
        user_id: userId,
        amount: String(amount),
        description,
      });
      set({ balanceAdjustment: amount, loading: false });
      toast.success("Balance reajustado");
    } catch (error) {
      set({ loading: false });
      console.error("Error setting balance adjustment:", error);
      toast.error("Error al reajustar el balance");
    }
  },

  clearBalanceAdjustment: async (userId: string) => {
    if (!userId) {
      toast.error("Usuario no autenticado");
      return;
    }

    set({ loading: true });
    try {
      await clearBalanceAdjustment(userId);
      set({ balanceAdjustment: 0, loading: false });
      toast.success("Reajuste eliminado");
    } catch (error) {
      set({ loading: false });
      console.error("Error clearing balance adjustment:", error);
      toast.error("Error al eliminar el reajuste");
    }
  },
}));