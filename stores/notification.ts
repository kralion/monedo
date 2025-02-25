import { NotificationStore, INotification } from "@/interfaces";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { toast } from "sonner-native";

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,

  addNotification: async (notification: INotification) => {
    // Generate a temporary ID for optimistic update
    const tempNotification = { ...notification, id: Date.now() };
    
    // Optimistically update the UI
    set((state) => ({
      notifications: [
        ...state.notifications,
        tempNotification
      ],
      loading: true
    }));
    
    // Attempt to save to the backend
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();
    
    if (error) {
      // Revert optimistic update on error
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== tempNotification.id),
        loading: false
      }));
      console.error("Error adding notification:", error);
      toast.error("Error al crear la notificación");
      return;
    }
    
    // Update with the real data from the server
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === tempNotification.id ? data : n
      ),
      loading: false
    }));
    
    toast.success("Notificación creada exitosamente");
  },

  getNotifications: async () => {
    set({ loading: true });

    const { data, error } = await supabase.from("notifications").select("*");

    if (error) throw error;

    set({ notifications: data ?? [], loading: false });
  },

  deleteNotification: async (id: number) => {
    // Store the original notifications for rollback if needed
    const originalNotifications = [...get().notifications];
    
    // Optimistically update the UI
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
      loading: true
    }));

    // Attempt to delete from the backend
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    
    if (error) {
      // Revert optimistic update on error
      set({
        notifications: originalNotifications,
        loading: false
      });
      console.error("Error deleting notification:", error);
      toast.error("Error al eliminar la notificación");
      return;
    }
    
    set({ loading: false });
    toast.success("Notificación eliminada exitosamente");
  },
}));
