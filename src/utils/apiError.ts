import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const apiMessage =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.response?.data?.error;
    return apiMessage || fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};
