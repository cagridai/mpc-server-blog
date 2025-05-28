import { create } from "zustand";
import type { Tag } from "@/types";
import { tagsService } from "../services/tags.service";

interface TagsState {
  tags: Tag[];
  popularTags: Tag[];
  isLoading: boolean;
  error: string | null;
}

interface TagsActions {
  fetchTags: () => Promise<void>;
  fetchPopularTags: () => Promise<void>;
  createTag: (tagData: { name: string }) => Promise<void>;
  clearError: () => void;
}

export const useTagsStore = create<TagsState & TagsActions>()((set) => ({
  tags: [],
  popularTags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const tags = await tagsService.getTags();
      set({ tags, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tags",
        isLoading: false,
      });
    }
  },

  fetchPopularTags: async () => {
    try {
      const popularTags = await tagsService.getPopularTags();
      set({ popularTags });
    } catch (error) {
      console.error("Failed to fetch popular tags:", error);
    }
  },

  createTag: async (tagData) => {
    set({ isLoading: true, error: null });
    try {
      const tag = await tagsService.createTag(tagData);
      set((state) => ({
        tags: [...state.tags, tag],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create tag",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
