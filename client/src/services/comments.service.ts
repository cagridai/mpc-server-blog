import { api } from "./api";
import type { Comment, CreateCommentRequest, CommentFilters } from "@/types";

export const commentsService = {
  async getCommentsByPost(
    postId: string,
    filters?: Omit<CommentFilters, "postId">
  ): Promise<Comment[]> {
    return api.get<Comment[]>(`/comments/post/${postId}`, filters);
  },

  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    return api.post<Comment>("/comments", commentData);
  },

  async replyToComment(replyData: CreateCommentRequest): Promise<Comment> {
    return api.post<Comment>("/comments/reply", replyData);
  },

  async updateComment(
    id: string,
    commentData: { content: string }
  ): Promise<Comment> {
    return api.patch<Comment>(`/comments/${id}`, commentData);
  },

  async deleteComment(id: string): Promise<void> {
    return api.delete<void>(`/comments/${id}`);
  },
};
