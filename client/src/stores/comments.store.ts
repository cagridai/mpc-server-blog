import { create } from "zustand";
import type { Comment, CreateCommentRequest } from "@/types";
import { commentsService } from "../services/comments.service";

interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CommentsActions {
  fetchCommentsByPost: (postId: string, page?: number) => Promise<void>;
  createComment: (commentData: CreateCommentRequest) => Promise<void>;
  replyToComment: (replyData: CreateCommentRequest) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  clearComments: () => void;
  clearError: () => void;
}

export const useCommentsStore = create<CommentsState & CommentsActions>()(
  (set, get) => ({
    comments: [],
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },

    fetchCommentsByPost: async (postId, page = 1) => {
      set({ isLoading: true, error: null });
      try {
        const response = await commentsService.getCommentsByPost(postId, {
          page,
          limit: 10,
        });
        set({
          comments: response.comments,
          pagination: response.meta || get().pagination,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch comments",
          isLoading: false,
        });
      }
    },

    createComment: async (commentData) => {
      set({ isLoading: true, error: null });
      try {
        const comment = await commentsService.createComment(commentData);
        set((state) => ({
          comments: [comment, ...state.comments],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to create comment",
          isLoading: false,
        });
        throw error;
      }
    },

    replyToComment: async (replyData) => {
      set({ isLoading: true, error: null });
      try {
        const reply = await commentsService.replyToComment(replyData);
        set((state) => ({
          comments: [reply, ...state.comments],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to create reply",
          isLoading: false,
        });
        throw error;
      }
    },

    updateComment: async (id, content) => {
      set({ isLoading: true, error: null });
      try {
        const updatedComment = await commentsService.updateComment(id, {
          content,
        });
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === id ? updatedComment : comment,
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to update comment",
          isLoading: false,
        });
        throw error;
      }
    },

    deleteComment: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await commentsService.deleteComment(id);
        set((state) => ({
          comments: state.comments.filter((comment) => comment.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to delete comment",
          isLoading: false,
        });
        throw error;
      }
    },

    clearComments: () =>
      set({
        comments: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    clearError: () => set({ error: null }),
  }),
);
