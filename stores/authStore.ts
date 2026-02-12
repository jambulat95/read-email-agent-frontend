import { create } from "zustand";
import type { User } from "@/types";
import { api } from "@/lib/api";
import { handleLoginSuccess, handleLogout } from "@/lib/auth";
import type { LoginCredentials, RegisterData } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    const tokens = await api.auth.login(credentials);
    handleLoginSuccess(tokens);
    const user = await api.auth.me();
    set({ user, isAuthenticated: true });
  },

  register: async (data) => {
    const tokens = await api.auth.register(data);
    handleLoginSuccess(tokens);
    const user = await api.auth.me();
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    handleLogout();
  },

  fetchUser: async () => {
    try {
      const user = await api.auth.me();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  initialize: async () => {
    api.loadTokens();
    if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
      try {
        const user = await api.auth.me();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
