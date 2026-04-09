import { isAxiosError } from "axios";
import { toast } from "./toast";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
// ============================================================================
// STRING & TYPE UTILITIES
// ============================================================================

export const cn = (
  ...classes: (string | boolean | undefined | null)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export const parsePositiveInt = (
  value: string | null,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const isPositiveInt = (
  value: number | null | undefined,
): value is number => {
  return value != null && value > 0;
};

export const formatClientOfficeId = (
  value: number | string | null | undefined,
): string => {
  if (value == null || value === "") return "—";
  return `#${value}`;
};

export const formatDate = (value: string | null): string => {
  if (!value) return "—";
  return format(parseISO(value), "dd/MM/yyyy", { locale: he });
};

export const formatMonthYear = (value: string | null): string => {
  if (!value) return "—";
  return format(parseISO(value), "MM.yyyy", { locale: he });
};

export const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  return format(parseISO(value), "dd/MM/yyyy HH:mm", { locale: he });
};

/** Last 5 years descending, for year-filter dropdowns. */
export const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: String(new Date().getFullYear() - i),
  label: String(new Date().getFullYear() - i),
}));

/**
 * Build a year options array from `from` up to current year + 1, newest first.
 * Default start: 2000.
 */

export const buildYearOptions = (
  from = 2000,
): { value: string; label: string }[] => {
  const end = new Date().getFullYear() + 1;
  return Array.from({ length: end - from + 1 }, (_, i) => ({
    value: String(end - i),
    label: String(end - i),
  }));
};

// ============================================================================
// LOCALE / DISPLAY CONSTANTS
// ============================================================================

export const MONTH_NAMES = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;

export const MONTH_OPTIONS = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1),
  label,
}));

export const fmtCurrency = (n: string | number | null): string => {
  if (n == null) return "—";
  const numeric = Number(n);
  if (Number.isNaN(numeric)) return "—";
  return `₪${numeric.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;
};

export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getHttpStatus = (error: unknown): number | null => {
  if (!isAxiosError(error)) return null;
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

  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || /timeout/i.test(error.message ?? "")) {
      return "הבקשה נמשכה יותר מדי זמן. נסה שוב.";
    }

    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail.trim();
    if (Array.isArray(detail)) return fallbackMessage;
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

/**
 * Convenience companion to `toast.error(message)`.
 * This is the intentional entry point when the caller has an unknown error
 * object and wants message extraction plus toast display in one step.
 *
 * It returns the resolved message so callers can also surface it inline.
 */
export const showErrorToast = (
  error: unknown,
  fallbackMessage: string,
  options?: ErrorOptions,
): string => {
  const message = resolveErrorMessage(error, fallbackMessage, options);
  toast.error(message);
  return message;
};
