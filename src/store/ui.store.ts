
import { create } from 'zustand';

type ToastTone = "success" | "error";

interface ToastState {
  tone: ToastTone;
  message: string;
}

interface UIState {
  isSidebarOpen: boolean;
  toast: ToastState | null;
  toggleSidebar: () => void;
  showToast: (message: string, tone?: ToastTone) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toast: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  showToast: (message, tone = "success") => set({ toast: { message, tone } }),
  hideToast: () => set({ toast: null }),
}));
