import { create } from "zustand";
import type {
  Post,
  PostFilters,
  CreatePostRequest,
  UpdatePostRequest,
} from "@/types";
import { postsService } from "../services/posts.service";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  featuredPosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PostsActions {
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  fetchFeaturedPosts: () => Promise<void>;
  createPost: (postData: CreatePostRequest) => Promise<Post>;
  updatePost: (id: string, postData: UpdatePostRequest) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  clearCurrentPost: () => void;
  clearError: () => void;
}

export const usePostsStore = create<PostsState & PostsActions>()(
  (set, get) => ({
    posts: [],
    currentPost: null,
    featuredPosts: [],
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },

    fetchPosts: async (filters) => {
      set({ isLoading: true, error: null });
      try {
        const posts = await postsService.getPosts(filters);
        set({
          posts: posts,
          pagination: {
            ...get().pagination,
            total: posts.length,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch posts",
          isLoading: false,
        });
      }
    },

    fetchPostBySlug: async (slug) => {
      if (!slug) {
        set({ error: "Invalid post slug", isLoading: false });
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const post = await postsService.getPostBySlug(slug);

        set({ currentPost: post, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch post by slug:", error);
        set({
          currentPost: null,
          error:
            error instanceof Error ? error.message : "Failed to fetch post",
          isLoading: false,
        });
      }
    },

    fetchFeaturedPosts: async () => {
      try {
        const posts = await postsService.getFeaturedPosts();
        set({ featuredPosts: posts });
      } catch (error) {
        console.error("Failed to fetch featured posts:", error);
      }
    },

    createPost: async (postData) => {
      set({ isLoading: true, error: null });
      try {
        const post = await postsService.createPost(postData);
        set((state) => ({
          posts: [post, ...state.posts],
          isLoading: false,
        }));
        return post;
      } catch (error) {
        console.error("Failed to create post:", error);
        set({
          error:
            error instanceof Error ? error.message : "Failed to create post",
          isLoading: false,
        });
        throw error;
      }
    },

    updatePost: async (id, postData) => {
      set({ isLoading: true, error: null });
      try {
        const updatedPost = await postsService.updatePost(id, postData);
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? updatedPost : post,
          ),
          currentPost:
            state.currentPost?.id === id ? updatedPost : state.currentPost,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to update post:", error);
        set({
          error:
            error instanceof Error ? error.message : "Failed to update post",
          isLoading: false,
        });
        throw error;
      }
    },

    deletePost: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await postsService.deletePost(id);
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
          currentPost: state.currentPost?.id === id ? null : state.currentPost, // Clear currentPost if it's the deleted one
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to delete post:", error);
        set({
          error:
            error instanceof Error ? error.message : "Failed to delete post",
          isLoading: false,
        });
        throw error;
      }
    },

    clearCurrentPost: () => set({ currentPost: null }),
    clearError: () => set({ error: null }),
  }),
);
