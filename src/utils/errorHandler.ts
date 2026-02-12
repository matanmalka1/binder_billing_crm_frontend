import axios from "axios";
import { getApiErrorMessage } from "./apiError";

interface HandleActionErrorParams {
  error: unknown;
  fallbackMessage: string;
  showToast: (message: string, tone?: "success" | "error") => void;
}

const getHttpStatus = (error: unknown): number | null => {
  if (!axios.isAxiosError(error)) return null;
  const status = error.response?.status;
  return typeof status === "number" ? status : null;
};

const resolveCanonicalActionMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  const status = getHttpStatus(error);
  if (status === 403) {
    return "אין הרשאה לבצע פעולה זו";
  }
  if (status === 500) {
    return "שגיאת שרת פנימית. נסה שוב בעוד מספר רגעים";
  }
  return getApiErrorMessage(error, fallbackMessage);
};

export const getRequestErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  return getApiErrorMessage(error, fallbackMessage);
};

export const handleCanonicalActionError = ({
  error,
  fallbackMessage,
  showToast,
}: HandleActionErrorParams): string => {
  const message = resolveCanonicalActionMessage(error, fallbackMessage);
  showToast(message, "error");
  return message;
};
