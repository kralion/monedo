import { NotificationStore, INotification } from "@/interfaces";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,

  addNotification: async (notification: INotification) => {
    set({ loading: true });
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now() },
      ],
    }));
    const { error } = await supabase.from("notifications").insert(notification);
    if (error) {
      console.error("Error adding notification:", error);
      await get().getNotifications();
    } else {
      await get().getNotifications();
    }
    set({ loading: false });
  },

  getNotifications: async () => {
    set({ loading: true });

    const { data, error } = await supabase.from("notifications").select("*");

    if (error) throw error;

    set({ notifications: data ?? [], loading: false });
  },

  deleteNotification: async (id: number) => {
    set({ loading: true });
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting notification:", error);
      await get().getNotifications();
    } else {
      await get().getNotifications();
    }
    set({ loading: false });
  },
}));
