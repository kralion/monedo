import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { db } from "@/db";
import { payments } from "@/schema";
import { eq, desc } from "drizzle-orm";

export interface Payment {
  id: string;
  amount: number;
  card_last4: string;
  card_type: string;
  status: "success" | "failed" | "pending";
  plan: "premium" | "free";
  user_id: string;
  created_at: Date;
}

interface PaymentState {
  payments: Payment[];
  isPayed: boolean;
  isLoading: boolean;
  addPayment: (payment: Omit<Payment, "id" | "created_at">) => Promise<void>;
  getPayments: (userId: string) => Promise<void>;
  getPaymentById: (id: string) => Promise<Payment | null>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  setIsPayed: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const storage = {
  getItem: (name: string) => {
    try {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : undefined;
    } catch {
      return undefined;
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      payments: [],
      isPayed: false,
      isLoading: false,

      addPayment: async (payment) => {
        try {
          set({ isLoading: true });
          const [data] = await db
            .insert(payments)
            .values({
              amount: payment.amount,
              card_last4: payment.card_last4,
              card_type: payment.card_type,
              status: payment.status,
              plan: payment.plan,
              user_id: payment.user_id,
            })
            .returning();

          if (!data) throw new Error("No data returned");

          set((state) => ({
            payments: [...state.payments, data as unknown as Payment],
          }));
          set({ isPayed: true });

          toast.success("Ahora eres premium !", {
            description: "Disfruta de todas las funcionalidades de Monedo",
          });
        } catch (error) {
          console.error("Error adding payment:", error);
          toast.error("Error al procesar el pago");
        } finally {
          set({ isLoading: false });
        }
      },

      getPayments: async (userId) => {
        try {
          set({ isLoading: true });
          const data = await db
            .select()
            .from(payments)
            .where(eq(payments.user_id, userId))
            .orderBy(desc(payments.created_at));

          set({ payments: (data as unknown as Payment[]) || [] });
        } catch (error) {
          console.error("Error fetching payments:", error);
          toast.error("Error al obtener los pagos");
        } finally {
          set({ isLoading: false });
        }
      },

      getPaymentById: async (id) => {
        try {
          const [data] = await db
            .select()
            .from(payments)
            .where(eq(payments.id, id));

          return (data as unknown as Payment) ?? null;
        } catch (error) {
          console.error("Error fetching payment:", error);
          toast.error("Error al obtener el pago");
          return null;
        }
      },

      updatePayment: async (id, updatedPayment) => {
        try {
          set({ isLoading: true });
          await db
            .update(payments)
            .set({
              ...(updatedPayment.amount !== undefined && { amount: updatedPayment.amount }),
              ...(updatedPayment.card_last4 !== undefined && { card_last4: updatedPayment.card_last4 }),
              ...(updatedPayment.card_type !== undefined && { card_type: updatedPayment.card_type }),
              ...(updatedPayment.status !== undefined && { status: updatedPayment.status }),
              ...(updatedPayment.plan !== undefined && { plan: updatedPayment.plan }),
            })
            .where(eq(payments.id, id));

          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id ? { ...payment, ...updatedPayment } : payment,
            ),
          }));

          toast.success("Pago actualizado con éxito");
        } catch (error) {
          console.error("Error updating payment:", error);
          toast.error("Error al actualizar el pago");
        } finally {
          set({ isLoading: false });
        }
      },

      deletePayment: async (id) => {
        try {
          set({ isLoading: true });
          await db.delete(payments).where(eq(payments.id, id));

          set((state) => ({
            payments: state.payments.filter((payment) => payment.id !== id),
          }));

          toast.success("Pago eliminado con éxito");
        } catch (error) {
          console.error("Error deleting payment:", error);
          toast.error("Error al eliminar el pago");
        } finally {
          set({ isLoading: false });
        }
      },

      setIsPayed: (value) => set({ isPayed: value }),
      setIsLoading: (value) => set({ isLoading: value }),
    }),
    { name: "payment-storage", storage },
  ),
);
