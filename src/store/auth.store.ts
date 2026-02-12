import { create } from "zustand";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import { authApi } from "../api/auth.api";
import type { UserRole } from "../types/common";
import { getRequestErrorMessage } from "../utils/errorHandler";
import type { AuthState } from "./auth.types";
import { clearStoredAuth, storedToken, storedUser } from "./auth.storage";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response;

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      clearStoredAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: getRequestErrorMessage(error, "שגיאה בהתחברות"),
        isLoading: false,
      });
    }
  },

  logout: () => {
    clearStoredAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  isAdvisor: () => get().user?.role === "advisor",
  hasRole: (role: UserRole) => get().user?.role === role,

  resetSession: () => {
    clearStoredAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EXPIRED_EVENT, () => {
    useAuthStore.getState().resetSession();
  });
}
