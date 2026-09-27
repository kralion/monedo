import { CategoryStore, ICategory } from "@/interfaces";
import { toast } from "sonner";
import { create } from "zustand";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/api/categories";

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

    try {
      const data = await addCategory({
        label: category.label,
        color: category.color,
        user_id: category.user_id,
      });

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === tempCategory.id ? ({ ...data, created_at: data.created_at } as ICategory) : c,
        ),
        loading: false,
      }));

      toast.success("Categoría registrada exitosamente");
    } catch (error) {
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== tempCategory.id),
        loading: false,
      }));
      toast.error("Ocurrió un error al registrar la categoría");
    }
  },

  getCategoryById: async (id: number) => {
    set({ loading: true });
    try {
      const data = await getCategoryById(id);
      set({ loading: false, category: data as ICategory });
      return data as ICategory;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateCategory: async (category: ICategory) => {
    const originalCategories = [...get().categories];
    const originalCategory = get().category;

    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c,
      ),
      category: category,
      loading: true,
    }));

    try {
      const data = await updateCategory({
        id: category.id,
        label: category.label,
        color: category.color,
      });

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === category.id ? ({ ...data } as ICategory) : c,
        ),
        category: { ...data } as ICategory,
        loading: false,
      }));

      toast.success("Categoría actualizada exitosamente");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({
        categories: originalCategories,
        category: originalCategory,
        loading: false,
      });
      toast.error("Ocurrió un error al actualizar la categoría");
    }
  },

  deleteCategory: async (id: number) => {
    const originalCategories = [...get().categories];

    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      loading: true,
    }));

    try {
      await deleteCategory(id);

      set({ loading: false });
      toast.success("Categoría eliminada exitosamente");
      if (typeof window !== "undefined") window.history.back();
    } catch (error) {
      set({ categories: originalCategories, loading: false });
      toast.error("Ocurrió un error al eliminar la categoría");
    }
  },

  getCategories: async (userId: string) => {
    set({ loading: true });
    try {
      const data = await getCategories(userId);
      set({ categories: (data as ICategory[]) ?? [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
