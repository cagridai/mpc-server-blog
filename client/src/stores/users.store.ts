import { create } from "zustand";
import type { User, UpdateUserRequest, PaginationParams } from "@/types";
import { usersService } from "@/services/users.service.ts";

interface UserStoreState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  getUsers: (params?: PaginationParams) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  user: null,
  loading: false,
  error: null,

  getUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await usersService.getUsers(params);
      set({ users: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch users", loading: false });
    }
  },

  getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const user = await usersService.getUserById(id);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user", loading: false });
    }
  },

  getUserByUsername: async (username) => {
    set({ loading: true, error: null });
    try {
      const user = await usersService.getUserByUsername(username);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user", loading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await usersService.updateUser(id, userData);
      set((state) => ({
        user: updatedUser,
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || "Failed to update user", loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
