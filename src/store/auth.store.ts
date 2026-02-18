import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { authApi } from "../api/auth.api";
import { getErrorMessage } from "../utils/utils";
import type { AuthState } from "./auth.types";

const AUTH_STORAGE_NAME = "auth-storage";

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

const stripTokenFromPersistedState = (
  rawValue: string,
  storage: Storage,
  key: string,
): string => {
  try {
    const parsed = JSON.parse(rawValue);
    if (parsed?.state?.token) {
      delete parsed.state.token;
      const sanitized = JSON.stringify(parsed);
      storage.setItem(key, sanitized);
      return sanitized;
    }
  } catch {
    // ignore parse errors and fall back to raw value
  }
  return rawValue;
};

const dynamicStorage: StateStorage = {
  getItem: (name) => {
    try {
      const localValue = localStorage.getItem(name);
      if (localValue) {
        return stripTokenFromPersistedState(localValue, localStorage, name);
      }

      const sessionValue = sessionStorage.getItem(name);
      if (sessionValue) {
        return stripTokenFromPersistedState(sessionValue, sessionStorage, name);
      }
      return null;
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

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        error: null,

        login: async (email: string, password: string, rememberMe = false) => {
          set({ isLoading: true, error: null });
          storageTarget.current = rememberMe ? "local" : "session";

          try {
            const response = await authApi.login({ email, password, rememberMe });
            const { user } = response;

            set({
              user,
              error: null,
              isLoading: false,
            });
          } catch (error: unknown) {
            set({
              user: null,
              error: getErrorMessage(error, "שגיאה בהתחברות"),
              isLoading: false,
            });
          }
        },

        logout: async () => {
          try {
            await authApi.logout();
          } catch {
            // Even if cookie clearing fails, drop local session state
          } finally {
            set({
              user: null,
              isLoading: false,
              error: null,
            });
          }
        },

        clearError: () => set({ error: null }),

        resetSession: () => {
          set({
            user: null,
            isLoading: false,
            error: null,
          });
        },
      }),
      {
        name: AUTH_STORAGE_NAME,
        storage: createJSONStorage(() => dynamicStorage),
        partialize: (state) => ({ user: state.user }),
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
