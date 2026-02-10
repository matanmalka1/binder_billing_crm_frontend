import { create } from 'zustand';
import { api } from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';

export type UserRole = 'advisor' | 'secretary';

export interface User {
  id: number;
  full_name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token
      localStorage.setItem('auth_token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error, 'שגיאה בהתחברות');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      localStorage.removeItem('auth_token');
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
