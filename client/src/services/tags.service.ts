import { api } from "./api";
import type { Tag, ApiResponse } from "@/types";

export const tagsService = {
  async getTags(): Promise<Tag[]> {
    const response = await api.get<ApiResponse<Tag[]>>("/tags");
    return response.data;
  },

  async getPopularTags(): Promise<Tag[]> {
    const response = await api.get<ApiResponse<Tag[]>>("/tags/popular");
    return response.data;
  },

  async createTag(tagData: { name: string }): Promise<Tag> {
    return api.post<Tag>("/tags", tagData);
  },
};
