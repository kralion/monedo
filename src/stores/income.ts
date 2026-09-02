import { IncomeStore, IIncome } from "@/interfaces";
import { desc } from "drizzle-orm";
import { toast } from "sonner";
import { create } from "zustand";
import { db } from "@/db";
import { incomes, debts } from "@/schema";
import { eq } from "drizzle-orm";

export const useIncomeStore = create<IncomeStore>((set, get) => ({
  incomes: [],
  income: null,
  loading: false,
  totalIncome: 0,

  addIncome: async (income: IIncome) => {
    const createdAt = income.created_at ?? new Date();

    set({ loading: true });

    try {
      if (income.id_debt) {
        // Get the debt to check remaining amount
        const [debt] = await db
          .select()
          .from(debts)
          .where(eq(debts.id, income.id_debt));

        if (!debt) throw new Error("Debt not found");

        const remaining = debt.amount;

        if (income.amount <= remaining) {
          // Fits within debt — single income linked to debt
          const tempIncome = { ...income, created_at: createdAt, id: Date.now() };
          set((state) => ({ incomes: [...state.incomes, tempIncome] }));

          const [data] = await db
            .insert(incomes)
            .values({
              amount: income.amount,
              description: income.description,
              user_id: income.user_id,
              created_at: createdAt,
              id_debt: income.id_debt,
            })
            .returning();

          if (!data) throw new Error("No data returned");

          set((state) => ({
            incomes: state.incomes.map((b) =>
              b.id === tempIncome.id ? (data as unknown as IIncome) : b,
            ),
          }));

          // Decrease debt amount
          const newAmount = remaining - income.amount;
          const newStatus = newAmount === 0 ? "paid" : debt.status;
          await db
            .update(debts)
            .set({ amount: newAmount, status: newStatus, updated_at: new Date() })
            .where(eq(debts.id, income.id_debt!));
        } else {
          // Overpayment — split into two incomes
          const linkedIncome: Omit<IIncome, "id"> = {
            ...income,
            amount: remaining,
            id_debt: income.id_debt,
          };
          const overflowIncome: Omit<IIncome, "id"> = {
            ...income,
            amount: income.amount - remaining,
            description: `Sobre pago de deuda ${debt.name}`,
            id_debt: null,
          };

          const tempLinked = { ...linkedIncome, created_at: createdAt, id: Date.now() };
          const tempOverflow = { ...overflowIncome, created_at: createdAt, id: Date.now() + 1 };

          set((state) => ({
            incomes: [...state.incomes, tempLinked, tempOverflow],
          }));

          const [dataLinked] = await db
            .insert(incomes)
            .values({
              amount: linkedIncome.amount,
              description: linkedIncome.description,
              user_id: linkedIncome.user_id,
              created_at: createdAt,
              id_debt: linkedIncome.id_debt,
            })
            .returning();

          const [dataOverflow] = await db
            .insert(incomes)
            .values({
              amount: overflowIncome.amount,
              description: overflowIncome.description,
              user_id: overflowIncome.user_id,
              created_at: createdAt,
            })
            .returning();

          set((state) => ({
            incomes: state.incomes.map((b) => {
              if (b.id === tempLinked.id && dataLinked) return dataLinked as unknown as IIncome;
              if (b.id === tempOverflow.id && dataOverflow) return dataOverflow as unknown as IIncome;
              return b;
            }),
          }));

          // Debt fully paid
          await db
            .update(debts)
            .set({ amount: 0, status: "paid", updated_at: new Date() })
            .where(eq(debts.id, income.id_debt!));
        }
      } else {
        // No debt linked — simple insert
        const tempIncome = { ...income, created_at: createdAt, id: Date.now() };
        set((state) => ({ incomes: [...state.incomes, tempIncome] }));

        const [data] = await db
          .insert(incomes)
          .values({
            amount: income.amount,
            description: income.description,
            user_id: income.user_id,
            created_at: createdAt,
          })
          .returning();

        if (!data) throw new Error("No data returned");

        set((state) => ({
          incomes: state.incomes.map((b) =>
            b.id === tempIncome.id ? (data as unknown as IIncome) : b,
          ),
        }));
      }

      get().getTotalIncome(income.user_id);
      set({ loading: false });
      toast.success("Registro exitoso");
    } catch (error) {
      set({ loading: false });
      console.error("Error adding income:", error);
      toast.error("Ocurrió un error al registrar el ingreso");
    }
  },

  getIncomeById: async (id: number) => {
    set({ loading: true });
    try {
      const [data] = await db
        .select()
        .from(incomes)
        .where(eq(incomes.id, id));

      if (!data) throw new Error("Income not found");

      set({ income: data as unknown as IIncome, loading: false });
      return data as unknown as IIncome;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getTotalIncome: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await db
        .select({ amount: incomes.amount })
        .from(incomes)
        .where(eq(incomes.user_id, userId));

      const total = data.reduce((sum, income) => sum + Number(income.amount), 0);
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
      const [data] = await db
        .update(incomes)
        .set({
          amount: income.amount,
          description: income.description,
        })
        .where(eq(incomes.id, income.id!))
        .returning();

      if (data) {
        set((state) => ({
          incomes: state.incomes.map((b) =>
            b.id === income.id ? (data as unknown as IIncome) : b,
          ),
          income:
            income.id === (originalIncome?.id || -1)
              ? (data as unknown as IIncome)
              : originalIncome,
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

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
      // If income was linked to a debt, restore the debt amount
      if (deletedIncome?.id_debt) {
        const [debt] = await db
          .select()
          .from(debts)
          .where(eq(debts.id, deletedIncome.id_debt));

        if (debt) {
          const restoredAmount = debt.amount + deletedIncome.amount;
          const newStatus = debt.status === "paid" ? "active" : debt.status;
          await db
            .update(debts)
            .set({ amount: restoredAmount, status: newStatus, updated_at: new Date() })
            .where(eq(debts.id, deletedIncome.id_debt));
        }
      }

      await db.delete(incomes).where(eq(incomes.id, id));

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
      const data = await db
        .select()
        .from(incomes)
        .where(eq(incomes.user_id, userId));

      set({ incomes: (data as unknown as IIncome[]) ?? [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getIncomesSortedByAmount: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await db
        .select()
        .from(incomes)
        .where(eq(incomes.user_id, userId))
        .orderBy(desc(incomes.amount));

      const incomesData = (data as unknown as IIncome[]) ?? [];
      set({ incomes: incomesData, loading: false });
      return incomesData;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
