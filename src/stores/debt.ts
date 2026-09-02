import { DebtStore, IDebt } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { db } from "@/db";
import { debts } from "@/schema";
import { eq, desc } from "drizzle-orm";

export const useDebtStore = create<DebtStore>((set, get) => ({
  debts: [],
  debt: null,
  loading: false,

  getDebts: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await db
        .select()
        .from(debts)
        .where(eq(debts.user_id, userId))
        .orderBy(desc(debts.created_at));

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
      const [data] = await db
        .select()
        .from(debts)
        .where(eq(debts.id, id));

      if (!data) throw new Error("Debt not found");

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
      const [data] = await db
        .insert(debts)
        .values({
          user_id: debt.user_id,
          name: debt.name,
          amount: debt.amount,
          original_amount: debt.original_amount,
          creditor: debt.creditor,
          notes: debt.notes,
          due_date: debt.due_date,
          status: debt.status,
        })
        .returning();

      if (!data) throw new Error("No data returned");

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
      const [data] = await db
        .update(debts)
        .set({
          name: debt.name,
          amount: debt.amount,
          original_amount: debt.original_amount,
          creditor: debt.creditor,
          notes: debt.notes,
          due_date: debt.due_date,
          status: debt.status,
          updated_at: new Date(),
        })
        .where(eq(debts.id, debt.id))
        .returning();

      if (!data) throw new Error("No data returned");

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

    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id),
      loading: true,
    }));

    try {
      await db.delete(debts).where(eq(debts.id, id));

      set({ loading: false });
      toast.success("Deuda eliminada exitosamente");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({ debts: originalDebts, loading: false });
      console.error("Error deleting debt:", error);
      toast.error("Ocurrió un error al eliminar la deuda");
    }
  },
}));
