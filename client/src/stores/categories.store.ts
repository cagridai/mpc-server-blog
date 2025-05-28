import { create } from "zustand";
import type { Category } from "@/types";
import { categoriesService } from "../services/categories.service";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  fetchCategoriesById: (id: string) => Promise<void>;
  createCategory: (categoryData: {
    name: string;
    description?: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
  (set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
      set({ isLoading: true, error: null });
      try {
        const categories = await categoriesService.getCategories();
        set({ categories, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch categories",
          isLoading: false,
        });
      }
    },

    fetchCategoriesById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const categoriesById = await categoriesService.getCategoryById(id);
        set({ categories: [categoriesById], isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch category",
          isLoading: false,
        });
      }
    },

    createCategory: async (categoryData) => {
      set({ isLoading: true, error: null });
      try {
        const category = await categoriesService.createCategory(categoryData);
        set((state) => ({
          categories: [...state.categories, category],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create category",
          isLoading: false,
        });
        throw error;
      }
    },

    clearError: () => set({ error: null }),
  }),
);
