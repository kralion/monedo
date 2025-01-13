import { CategoryStore, ICategory } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";
import { supabase } from "~/lib/supabase";

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  category: null,
  loading: false,

  addCategory: async (category: ICategory) => {
    set({ loading: true });
    set((state) => ({
      categories: [...state.categories, { ...category, id: Date.now() }],
    }));

    const { error } = await supabase.from("categories").insert(category);
    if (error) {
      toast.error("Ocurrió un error al registrar la categoría");
      console.log(error);
      await get().getCategories();
    } else {
      toast.success("Categoría registrada exitosamente");
    }
    set({ loading: false });
  },

  updateCategory: async (category: ICategory) => {
    set({ loading: true });
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c
      ),
    }));

    const { error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", category.id);
    if (error) {
      toast.error("Ocurrió un error al actualizar la categoría");
      await get().getCategories();
    } else {
      toast.success("Categoría actualizada exitosamente");
      router.back();
    }
    set({ loading: false });
  },

  deleteCategory: async (id: number) => {
    set({ loading: true });
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting category:", error);
      await get().getCategories();
      return;
    }

    toast.success("Categoría eliminada exitosamente");
    router.push("/(auth)/(tabs)");
    set({ loading: false });
  },

  getCategories: async () => {
    set({ loading: true });

    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;

    set({ categories: data ?? [], loading: false });
  },
}));