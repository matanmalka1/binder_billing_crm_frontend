import { toast as sonnerToast } from "sonner";

const RTL_STYLE: React.CSSProperties = { direction: "rtl" };

const notify = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  options?: { duration?: number; description?: string },
) => {
  const base = { style: RTL_STYLE };
  const durationDefaults: Record<typeof type, number> = {
    success: 4000,
    error: 6000,
    info: 4000,
    warning: 5000,
  };

  sonnerToast[type](message, {
    ...base,
    description: options?.description,
    duration: options?.duration ?? durationDefaults[type],
  });
};

export const toast = {
  success: (message: string, options?: { duration?: number }) =>
    notify("success", message, options),
  error: (message: string, options?: { duration?: number; description?: string }) =>
    notify("error", message, options),
  info: (message: string, options?: { duration?: number }) =>
    notify("info", message, options),
  warning: (message: string, options?: { duration?: number }) =>
    notify("warning", message, options),
};
