import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "~/lib/supabase";
import { toast } from "sonner-native";

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

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      payments: [],
      isPayed: false,
      isLoading: false,

      addPayment: async (payment) => {
        try {
          set({ isLoading: true });
          const { error, data } = await supabase
            .from("payments")
            .insert({
              amount: payment.amount,
              card_last4: payment.card_last4,
              card_type: payment.card_type,
              status: payment.status,
              plan: payment.plan,
              user_id: payment.user_id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            payments: [...state.payments, data],
          }));

          // Trigger confetti animation
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
          const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) throw error;

          set({ payments: data || [] });
        } catch (error) {
          console.error("Error fetching payments:", error);
          toast.error("Error al obtener los pagos");
        } finally {
          set({ isLoading: false });
        }
      },

      getPaymentById: async (id) => {
        try {
          const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;

          return data;
        } catch (error) {
          console.error("Error fetching payment:", error);
          toast.error("Error al obtener el pago");
          return null;
        }
      },

      updatePayment: async (id, updatedPayment) => {
        try {
          set({ isLoading: true });
          const { error } = await supabase
            .from("payments")
            .update(updatedPayment)
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id ? { ...payment, ...updatedPayment } : payment
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
          const { error } = await supabase
            .from("payments")
            .delete()
            .eq("id", id);

          if (error) throw error;

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

      setIsPayed: (value) => {
        set({ isPayed: value });
      },

      setIsLoading: (value) => {
        set({ isLoading: value });
      },
    }),
    {
      name: "payment-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
