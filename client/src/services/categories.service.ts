import { api } from "./api";
import type { Category, ApiResponse } from "@/types";

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    return api.get<Category>(`/categories/${id}`);
  },

  async createCategory(categoryData: {
    name: string;
    description?: string;
  }): Promise<Category> {
    return api.post<Category>("/categories", categoryData);
  },
};
