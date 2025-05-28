import { api } from "./api";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
  ApiResponse,
} from "@/types";

export const postsService = {
  async getPosts(filters?: PostFilters): Promise<ApiResponse<Post[]>> {
    return api.get<ApiResponse<Post[]>>("/posts", filters);
  },

  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return api.get<ApiResponse<Post>>(`/posts/${slug}`);
  },

  async createPost(postData: CreatePostRequest): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>("/posts", postData);
    return response.data;
  },

  async updatePost(id: string, postData: UpdatePostRequest): Promise<Post> {
    const response = await api.patch<ApiResponse<Post>>(
      `/posts/${id}`,
      postData,
    );
    return response.data;
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
