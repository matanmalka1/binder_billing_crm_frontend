import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import { authApi } from "../api/auth.api";
import { getErrorMessage } from "../utils/utils";
import type { AuthState } from "./auth.types";
import { clearStoredAuth, storedToken, storedUser } from "./auth.storage";

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: storedUser,
      token: storedToken,
      isLoading: false,
      error: null,

      login: async (email: string, password: string, rememberMe = false) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login({ email, password, rememberMe });
          const { token, user } = response;

          if (rememberMe) {
            localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
            sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
          } else {
            sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
            localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
          }
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

          set({
            user,
            token,
            error: null,
            isLoading: false,
          });
        } catch (error: unknown) {
          clearStoredAuth();
          set({
            user: null,
            token: null,
            error: getErrorMessage(error, "שגיאה בהתחברות"),
            isLoading: false,
          });
        }
      },

      logout: () => {
        clearStoredAuth();
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      resetSession: () => {
        clearStoredAuth();
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: "AuthStore" },
  ),
);

const attachAuthExpiredListener = () => {
  if (typeof window === "undefined") return;
  const handler = () => useAuthStore.getState().resetSession();
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
};

attachAuthExpiredListener();
