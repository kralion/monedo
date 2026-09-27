import { DebtStore, IDebt } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import {
  addDebt,
  deleteDebt,
  getDebtById,
  getDebts,
  updateDebt,
} from "@/api/debts";

export const useDebtStore = create<DebtStore>((set, get) => ({
  debts: [],
  debt: null,
  loading: false,

  getDebts: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await getDebts(userId);
      set({ debts: (data as unknown as IDebt[]) ?? [], loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching debts:", error);
      toast.error("Error al obtener las deudas");
    }
  },

  getDebtById: async (id: number) => {
    set({ loading: true });
    try {
      const data = await getDebtById(id);
      set({ debt: data as unknown as IDebt, loading: false });
      return data as unknown as IDebt;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching debt:", error);
      toast.error("Error al obtener la deuda");
      throw error;
    }
  },

  addDebt: async (debt: IDebt) => {
    const tempDebt = { ...debt, id: Date.now() };

    set((state) => ({
      debts: [tempDebt, ...state.debts],
      loading: true,
    }));

    try {
      const data = await addDebt({
        user_id: debt.user_id,
        name: debt.name,
        amount: debt.amount,
        original_amount: debt.original_amount,
        creditor: debt.creditor,
        notes: debt.notes,
        status: debt.status,
      });

      set((state) => ({
        debts: state.debts.map((d) =>
          d.id === tempDebt.id ? (data as unknown as IDebt) : d,
        ),
        loading: false,
      }));

      toast.success("Deuda registrada");
    } catch (error) {
      set((state) => ({
        debts: state.debts.filter((d) => d.id !== tempDebt.id),
        loading: false,
      }));
      console.error("Error adding debt:", error);
      toast.error("Ocurrió un error al registrar la deuda");
    }
  },

  updateDebt: async (debt: IDebt) => {
    const originalDebts = [...get().debts];
    const originalDebt = get().debt;

    set((state) => ({
      debts: state.debts.map((d) => (d.id === debt.id ? debt : d)),
      debt: debt.id === (originalDebt?.id || -1) ? debt : originalDebt,
      loading: true,
    }));

    try {
      const data = await updateDebt({
        id: debt.id,
        name: debt.name,
        amount: debt.amount,
        original_amount: debt.original_amount,
        creditor: debt.creditor,
        notes: debt.notes,
        status: debt.status,
      });

      set((state) => ({
        debts: state.debts.map((d) =>
          d.id === debt.id ? (data as unknown as IDebt) : d,
        ),
        debt:
          debt.id === (originalDebt?.id || -1)
            ? (data as unknown as IDebt)
            : originalDebt,
        loading: false,
      }));

      toast.success("Deuda actualizada");
    } catch (error) {
      set({
        debts: originalDebts,
        debt: originalDebt,
        loading: false,
      });
      console.error("Error updating debt:", error);
      toast.error("Ocurrió un error al actualizar la deuda");
    }
  },

  deleteDebt: async (id: number) => {
    const originalDebts = [...get().debts];
    const originalDebt = get().debt;

    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id),
      loading: true,
    }));

    try {
      await deleteDebt(id);

      set((state) => ({
        loading: false,
        debt: state.debt?.id === id ? null : state.debt,
      }));
      toast.success("Deuda eliminada exitosamente");
    } catch (error) {
      set({ debts: originalDebts, debt: originalDebt, loading: false });
      console.error("Error deleting debt:", error);
      toast.error("Ocurrió un error al eliminar la deuda");
      throw error;
    }
  },
}));
