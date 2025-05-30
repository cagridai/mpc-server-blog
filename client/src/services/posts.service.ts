import { api } from "./api";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
  ApiResponse,
} from "@/types";

export const postsService = {
  async getPosts(filters?: PostFilters): Promise<Post[]> {
    return api.get<Post[]>("/posts", filters);
  },

  async getPostBySlug(slug: string): Promise<Post> {
    return api.get<Post>(`/posts/${slug}`);
  },

  async createPost(postData: CreatePostRequest): Promise<Post> {
    return api.post<Post>("/posts", postData);
  },

  async updatePost(id: string, postData: UpdatePostRequest): Promise<Post> {
    return api.patch<Post>(`/posts/${id}`, postData);
  },

  async deletePost(id: string): Promise<void> {
    await api.delete<void>(`/posts/${id}`);
  },

  async getFeaturedPosts(): Promise<Post[]> {
    const response = await api.get<ApiResponse<Post[]>>("/posts", {
      featured: true,
      published: true,
      limit: 6,
    });
    return response.data;
  },
};
