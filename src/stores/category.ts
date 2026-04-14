import { CategoryStore, ICategory } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  category: {} as ICategory,
  loading: false,
  addCategory: async (category: ICategory) => {
    const tempCategory = { ...category, id: Date.now() };

    set((state) => ({
      categories: [...state.categories, tempCategory],
      loading: true,
    }));

    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== tempCategory.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar la categoría");
      return;
    }

    set((state) => ({
      categories: state.categories.map((c) => (c.id === tempCategory.id ? data : c)),
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
    const originalCategories = [...get().categories];
    const originalCategory = get().category;

    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
      category: category,
      loading: true,
    }));

    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", category.id)
      .select()
      .single();

    if (error) {
      set({
        categories: originalCategories,
        category: originalCategory,
        loading: false,
      });
      toast.error("Ocurrió un error al actualizar la categoría");
      return;
    }

    if (data) {
      set((state) => ({
        categories: state.categories.map((c) => (c.id === category.id ? data : c)),
        category: data,
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    toast.success("Categoría actualizada exitosamente");
    if (typeof window !== "undefined") window.history.back();
  },

  deleteCategory: async (id: number) => {
    const originalCategories = [...get().categories];

    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      loading: true,
    }));

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      set({ categories: originalCategories, loading: false });
      toast.error("Ocurrió un error al eliminar la categoría");
      return;
    }

    set({ loading: false });
    toast.success("Categoría eliminada exitosamente");
    if (typeof window !== "undefined") window.history.back();
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
