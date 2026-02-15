import axios from "axios";
import { toast } from "sonner";
import type { BackendErrorEnvelope } from "../types/common";

// ============================================================================
// STRING & TYPE UTILITIES
// ============================================================================

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const toText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export const parsePositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

// ============================================================================
// DATETIME UTILITIES
// ============================================================================

export const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleString("he-IL");
};

// ============================================================================
// API ERROR EXTRACTION
// ============================================================================

const extractDetailText = (detail: unknown): string | null => {
  const detailText = toText(detail);
  if (detailText) return detailText;

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (first && typeof first === "object") {
      const firstMessage = toText((first as { msg?: unknown }).msg);
      if (firstMessage) return firstMessage;

      const nestedDetail = toText((first as { detail?: unknown }).detail);
      if (nestedDetail) return nestedDetail;
    }
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

const resolveCanonicalActionMessage = (error: unknown, fallbackMessage: string): string => {
  const status = getHttpStatus(error);
  if (status === 403) return "אין הרשאה לבצע פעולה זו";
  if (status === 500) return "שגיאת שרת פנימית. נסה שוב בעוד מספר רגעים";
  return getApiErrorMessage(error, fallbackMessage);
};

export const getRequestErrorMessage = (error: unknown, fallbackMessage: string): string => {
  return getApiErrorMessage(error, fallbackMessage);
};

export const handleCanonicalActionError = ({
  error,
  fallbackMessage,
}: {
  error: unknown;
  fallbackMessage: string;
}): string => {
  const message = resolveCanonicalActionMessage(error, fallbackMessage);
  toast.error(message);
  return message;
};