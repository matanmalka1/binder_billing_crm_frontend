import axios from "axios";
import { toast } from "./toast";
import type { BackendErrorEnvelope } from "../types/common";

// ============================================================================
// STRING & TYPE UTILITIES
// ============================================================================

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const toText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  return value.trim().length > 0 ? value.trim() : null;
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

// ============================================================================
// DATETIME UTILITIES
// ============================================================================

const HE_LOCALE = "he-IL";

export const formatDate = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(HE_LOCALE);
};

export const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleString(HE_LOCALE);
};

// ============================================================================
// API ERROR EXTRACTION
// ============================================================================

const extractDetailText = (detail: unknown): string | null => {
  // Backend errors arrive either as a plain string or a Pydantic-style array
  // like [{ msg: "...", loc: [...] }]; keep parsing minimal and predictable.
  if (typeof detail === "string") return detail.trim() || null;

  if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object") {
    const maybeMsg = (detail[0] as { msg?: unknown }).msg;
    if (typeof maybeMsg === "string") return maybeMsg.trim() || null;
  }

  return null;
};

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError<BackendErrorEnvelope>(error)) {
    const responseData = error.response?.data;

    const detailMessage = extractDetailText(responseData?.detail);
    if (detailMessage) return detailMessage;

    const messageText = toText(responseData?.message);
    if (messageText) return messageText;

    const errorText = toText(responseData?.error);
    if (errorText) return errorText;

    if (responseData?.error && typeof responseData.error === "object") {
      const nestedDetail = extractDetailText(
        (responseData.error as { detail?: unknown }).detail,
      );
      if (nestedDetail) return nestedDetail;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

// ============================================================================
// ERROR HANDLING (PUBLIC API)
// ============================================================================

const getHttpStatus = (error: unknown): number | null => {
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

  return getApiErrorMessage(error, fallbackMessage);
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
