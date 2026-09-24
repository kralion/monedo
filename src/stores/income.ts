import { IncomeStore, IIncome } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import {
  addIncomeFn,
  deleteIncomeFn,
  getIncomeByIdFn,
  getIncomesFn,
  getIncomesPaginatedFn,
  getIncomesSortedByAmountFn,
  getTotalIncomeFn,
  updateIncomeFn,
} from "@/server/incomes";

export const useIncomeStore = create<IncomeStore>((set, get) => ({
  incomes: [],
  income: null,
  loading: false,
  totalIncome: 0,

  addIncome: async (income: IIncome) => {
    const createdAt = income.created_at ?? new Date();
    set({ loading: true });
    const tempId = Date.now();
    const tempIncome = { ...income, created_at: createdAt, id: tempId } as IIncome;
    // optimistic for simple case; server handles debt logic atomically
    set((state) => ({ incomes: [...state.incomes, tempIncome] }));

    try {
      const rows = await addIncomeFn({
        data: {
          amount: String(income.amount),
          description: income.description,
          user_id: income.user_id,
          created_at: createdAt.toISOString(),
          id_debt: income.id_debt ?? null,
        },
      });

      // rows is array (1 or 2 items when debt overflow)
      const normalized = (rows as unknown as IIncome[]).map((r) => ({
        ...r,
        amount: Number(r.amount as unknown as string),
      }));

      set((state) => ({
        incomes: [...state.incomes.filter((b) => b.id !== tempId), ...normalized],
        loading: false,
      }));

      get().getTotalIncome(income.user_id);
      toast.success("Registro exitoso");
    } catch (error) {
      set((state) => ({
        incomes: state.incomes.filter((b) => b.id !== tempId && b.id !== tempId + 1),
        loading: false,
      }));
      console.error("Error adding income:", error);
      toast.error("Ocurrió un error al registrar el ingreso");
    }
  },

  getIncomeById: async (id: number) => {
    set({ loading: true });
    try {
      const data = await getIncomeByIdFn({ data: { id } });
      const normalized = { ...data, amount: Number(data.amount as unknown as string) } as unknown as IIncome;
      set({ income: normalized, loading: false });
      return normalized;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getTotalIncome: async (userId: string) => {
    set({ loading: true });
    try {
      const total = await getTotalIncomeFn({ data: { userId } });
      set({ totalIncome: total, loading: false });
      return total;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateIncome: async (income: IIncome) => {
    const originalIncomes = [...get().incomes];
    const originalIncome = get().income;

    set((state) => ({
      incomes: state.incomes.map((b) => (b.id === income.id ? income : b)),
      income: income.id === (originalIncome?.id || -1) ? income : originalIncome,
      loading: true,
    }));

    try {
      const data = await updateIncomeFn({
        data: { id: income.id!, amount: String(income.amount), description: income.description },
      });
      const normalized = { ...data, amount: Number(data.amount as unknown as string) } as unknown as IIncome;
      set((state) => ({
        incomes: state.incomes.map((b) => (b.id === income.id ? normalized : b)),
        income: income.id === (originalIncome?.id || -1) ? normalized : originalIncome,
        loading: false,
      }));

      get().getTotalIncome(income.user_id);
      toast.success("Ingreso actualizado");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({ incomes: originalIncomes, income: originalIncome, loading: false });
      toast.error("Ocurrió un error al actualizar el ingreso");
    }
  },

  deleteIncome: async (id: number) => {
    const originalIncomes = [...get().incomes];
    const deletedIncome = get().incomes.find((b) => b.id === id);

    set((state) => ({
      incomes: state.incomes.filter((b) => b.id !== id),
      loading: true,
    }));

    try {
      await deleteIncomeFn({ data: { id } });

      if (deletedIncome?.user_id) {
        get().getTotalIncome(deletedIncome.user_id);
      }

      set({ loading: false });
      toast.success("Eliminado exitosamente");
    } catch (error) {
      set({ incomes: originalIncomes, loading: false });
      toast.error("Error al eliminar ingreso");
    }
  },

  getIncomes: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await getIncomesFn({ data: { userId } });
      const normalized = (data as unknown as IIncome[]).map((i) => ({
        ...i,
        amount: Number(i.amount as unknown as string),
      }));
      set({ incomes: normalized ?? [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getIncomesSortedByAmount: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await getIncomesSortedByAmountFn({ data: { userId } });
      const normalized = (data as unknown as IIncome[]).map((i) => ({
        ...i,
        amount: Number(i.amount as unknown as string),
      }));
      set({ incomes: normalized ?? [], loading: false });
      return normalized;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getIncomesPaginated: async (userId: string, limit: number, offset: number) => {
    try {
      const data = await getIncomesPaginatedFn({ data: { userId, limit, offset } });
      const normalized = (data as unknown as IIncome[]).map((i) => ({
        ...i,
        amount: Number(i.amount as unknown as string),
      }));
      return normalized;
    } catch (error) {
      console.error("Error fetching paginated incomes:", error);
      toast.error("Error al obtener ingresos paginados");
      return [];
    }
  },
}));
