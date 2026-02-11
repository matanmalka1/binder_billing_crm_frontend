import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

const toText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

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

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data as
      | (ApiErrorResponse & {
          detail?: unknown;
          error?: unknown;
        })
      | undefined;

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
