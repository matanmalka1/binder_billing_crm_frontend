import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 4000,
      style: {
        direction: "rtl",
      },
    });
  },

  error: (
    message: string,
    options?: { duration?: number; description?: string },
  ) => {
    sonnerToast.error(message, {
      duration: options?.duration ?? 6000,
      description: options?.description,
      style: {
        direction: "rtl",
      },
    });
  },

  info: (message: string) => {
    sonnerToast.info(message, {
      duration: 4000,
      style: {
        direction: "rtl",
      },
    });
  },

  warning: (message: string) => {
    sonnerToast.warning(message, {
      duration: 5000,
      style: {
        direction: "rtl",
      },
    });
  },
};
