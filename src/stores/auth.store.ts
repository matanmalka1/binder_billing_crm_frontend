
import { create } from 'zustand';
import type { AuthState, User } from '../types/common';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Mocked for Sprint 1
  user: { name: 'ישראל ישראלי', role: 'advisor' }, // Mocked user
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
