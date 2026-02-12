import { create } from "zustand";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import { authApi } from "../api/auth.api";
import type { AuthUser, UserRole } from "../types/common";
import { getRequestErrorMessage } from "../utils/errorHandler";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAdvisor: () => boolean;
  hasRole: (role: UserRole) => boolean;
  resetSession: () => void;
}

const parseStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed?.id === "number" &&
      typeof parsed?.full_name === "string" &&
      (parsed?.role === "advisor" || parsed?.role === "secretary")
    ) {
      return {
        id: parsed.id,
        full_name: parsed.full_name,
        role: parsed.role,
      };
    }
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }

  return null;
};

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
const storedUser = parseStoredUser();

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
