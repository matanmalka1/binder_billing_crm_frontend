import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import { authApi } from "../api/auth.api";
import { getErrorMessage } from "../utils/utils";
import type { AuthState } from "./auth.types";

const AUTH_STORAGE_NAME = "auth-storage";

const clearLegacyAuthStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch {
    // ignore storage access errors (e.g., SSR or disabled storage)
  }
};

const getInitialTarget = (): "local" | "session" => {
  if (typeof window === "undefined") return "local";
  try {
    if (localStorage.getItem(AUTH_STORAGE_NAME)) return "local";
    if (sessionStorage.getItem(AUTH_STORAGE_NAME)) return "session";
  } catch {
    // fall back to local
  }
  return "local";
};

const storageTarget = { current: getInitialTarget() };

const dynamicStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name) ?? sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const primary =
        storageTarget.current === "local" ? localStorage : sessionStorage;
      const secondary =
        storageTarget.current === "local" ? sessionStorage : localStorage;
      primary.setItem(name, value);
      secondary.removeItem(name);
    } catch {
      // ignore storage write failures
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {}
    try {
      sessionStorage.removeItem(name);
    } catch {}
  },
};

clearLegacyAuthStorage();

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,

        login: async (email: string, password: string, rememberMe = false) => {
          set({ isLoading: true, error: null });
          storageTarget.current = rememberMe ? "local" : "session";

          try {
            const response = await authApi.login({ email, password, rememberMe });
            const { token, user } = response;

            set({
              user,
              token,
              error: null,
              isLoading: false,
            });
          } catch (error: unknown) {
            set({
              user: null,
              token: null,
              error: getErrorMessage(error, "שגיאה בהתחברות"),
              isLoading: false,
            });
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        },

        clearError: () => set({ error: null }),

        resetSession: () => {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        },
      }),
      {
        name: AUTH_STORAGE_NAME,
        storage: createJSONStorage(() => dynamicStorage),
        partialize: (state) => ({ user: state.user, token: state.token }),
        onRehydrateStorage: () => () => {
          try {
            if (typeof window === "undefined") return;
            if (localStorage.getItem(AUTH_STORAGE_NAME)) {
              storageTarget.current = "local";
            } else if (sessionStorage.getItem(AUTH_STORAGE_NAME)) {
              storageTarget.current = "session";
            }
          } catch {
            // keep existing target
          }
        },
      },
    ),
    { name: "AuthStore" },
  ),
);

const attachAuthExpiredListener = () => {
  if (typeof window === "undefined") return;
  const handler = () => useAuthStore.getState().resetSession();
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
};

attachAuthExpiredListener();
