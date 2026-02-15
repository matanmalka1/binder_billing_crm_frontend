import type { AuthUser ,UserRole } from "../types/common";

export interface AuthState {
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
