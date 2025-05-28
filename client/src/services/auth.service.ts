import { api } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ChangePasswordRequest,
} from "@/types";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/register", userData);
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  async logout(): Promise<void> {
    return api.post<void>("/auth/logout");
  },

  async changePassword(
    userId: string,
    passwords: ChangePasswordRequest,
  ): Promise<void> {
    return api.post<void>(`/users/${userId}/change-password`, passwords);
  },
};
