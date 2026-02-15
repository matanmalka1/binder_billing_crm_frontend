import { create } from "zustand";
import { authApi } from "../api/auth.api";
import { getRequestErrorMessage } from "../utils/utils";

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = "advisor" | "secretary";

export interface AuthUser {
  id: number;
  full_name: string;
  role: UserRole;
}

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

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

type StoreState = AuthState & UIState;

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_EXPIRED_EVENT = "auth:expired";

const parseStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed?.id === "number" &&
      typeof parsed?.full_name === "string" &&
      (parsed?.role === "advisor" || parsed?.role === "secretary")
    ) {
      return { id: parsed.id, full_name: parsed.full_name, role: parsed.role };
    }
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return null;
};

const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const storedUser = parseStoredUser();

// ============================================================================
// STORE
// ============================================================================

export const useStore = create<StoreState>((set, get) => ({
  // Auth State
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

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

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

  // UI State
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// Export legacy alias for backward compatibility
export const useAuthStore = useStore;
export const useUIStore = useStore;

// ============================================================================
// AUTH EXPIRED HANDLER
// ============================================================================

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EXPIRED_EVENT, () => {
    useStore.getState().resetSession();
  });
}

// Export constants for use in API client
export const AUTH_TOKEN_STORAGE_KEY = AUTH_TOKEN_KEY;
export const AUTH_USER_STORAGE_KEY = AUTH_USER_KEY;
export const AUTH_EXPIRED_EVENT_NAME = AUTH_EXPIRED_EVENT;
