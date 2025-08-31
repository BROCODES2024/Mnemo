import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/users/signin", {
            username,
            password,
          });
          const { token } = response.data;

          // Store token in localStorage for API interceptor
          localStorage.setItem("token", token);

          // Decode username from response or token
          set({
            token,
            isAuthenticated: true,
            user: { id: "", username },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.msg || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/users/signup", { username, password });
          // After successful signup, automatically login
          await get().login(username, password);
        } catch (error: any) {
          set({
            error: error.response?.data?.msg || "Signup failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
