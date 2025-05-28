import { api } from "./api";
import type {
  User,
  UpdateUserRequest,
  ApiResponse,
  PaginationParams,
} from "@/types";

export const usersService = {
  async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    return api.get<ApiResponse<User[]>>("/users", params);
  },

  async getUserById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  async getUserByUsername(username: string): Promise<User> {
    return api.get<User>(`/users/username/${username}`);
  },

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return api.patch<User>(`/users/${id}`, userData);
  },
};
