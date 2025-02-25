import { CategoryStore, ICategory } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  category: {} as ICategory,
  loading: false,
  addCategory: async (category: ICategory) => {
    // Generate a temporary ID for optimistic update
    const tempCategory = { ...category, id: Date.now() };

    // Optimistically update the UI
    set((state) => ({
      categories: [...state.categories, tempCategory],
      loading: true,
    }));

    // Attempt to save to the backend
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      // Revert optimistic update on error
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== tempCategory.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar la categoría");
      console.log(error);
      return;
    }

    // Update with the real data from the server
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === tempCategory.id ? data : c
      ),
      loading: false,
    }));

    toast.success("Categoría registrada exitosamente");
  },

  getCategoryById: async (id: number) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    set({ loading: false, category: data });
    return data;
  },

  updateCategory: async (category: ICategory) => {
    // Store the original categories for rollback if needed
    const originalCategories = [...get().categories];
    const originalCategory = get().category;

    // Optimistically update the UI
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c
      ),
      category: category,
      loading: true,
    }));

    // Attempt to update in the backend
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", category.id)
      .select()
      .single();

    if (error) {
      // Revert optimistic update on error
      set({
        categories: originalCategories,
        category: originalCategory,
        loading: false,
      });
      toast.error("Ocurrió un error al actualizar la categoría");
      return;
    }

    // Update with the real data from the server if available
    if (data) {
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === category.id ? data : c
        ),
        category: data,
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    toast.success("Categoría actualizada exitosamente");
    router.back();
  },

  deleteCategory: async (id: number) => {
    // Store the original categories for rollback if needed
    const originalCategories = [...get().categories];

    // Optimistically update the UI
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      loading: true,
    }));

    // Attempt to delete from the backend
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      // Revert optimistic update on error
      set({
        categories: originalCategories,
        loading: false,
      });
      toast.error("Ocurrió un error al eliminar la categoría");
      console.error("Error deleting category:", error);
      return;
    }

    set({ loading: false });
    toast.success("Categoría eliminada exitosamente");
    router.back();
  },

  getCategories: async (userId: string) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;

    set({ categories: data ?? [], loading: false });
  },
}));
