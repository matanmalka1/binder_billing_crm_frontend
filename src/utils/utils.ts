import axios from "axios";
import { toast } from "./toast";

// ============================================================================
// STRING & TYPE UTILITIES
// ============================================================================

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export const parsePositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const isPositiveInt = (value: number | null | undefined): value is number => {
  return value != null && value > 0;
};


import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";

export const formatDate = (value: string | null): string => {
  if (!value) return "—";
  return format(parseISO(value), "d.M.yyyy", { locale: he });
};

export const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  return format(parseISO(value), "d.M.yyyy HH:mm", { locale: he });
};


export const getHttpStatus = (error: unknown): number | null => {
  if (!axios.isAxiosError(error)) return null;
  const status = error.response?.status;
  return typeof status === "number" ? status : null;
};

type ErrorOptions = {
  canonicalAction?: boolean;
};

const resolveErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  options?: ErrorOptions,
): string => {
  if (options?.canonicalAction) {
    const status = getHttpStatus(error);
    if (status === 403) return "אין הרשאה לבצע פעולה זו";
    if (status === 500) return "שגיאת שרת פנימית. נסה שוב בעוד מספר רגעים";
  }

  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail.trim();
    if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object") {
      const msg = (detail[0] as { msg?: unknown }).msg;
      if (typeof msg === "string" && msg.trim()) return msg.trim();
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  options?: ErrorOptions,
): string => resolveErrorMessage(error, fallbackMessage, options);

export const showErrorToast = (
  error: unknown,
  fallbackMessage: string,
  options?: ErrorOptions,
): string => {
  const message = resolveErrorMessage(error, fallbackMessage, options);
  toast.error(message);
  return message;
};
