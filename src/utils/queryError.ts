import { getRequestErrorMessage } from "./errorHandler";

export const resolveQueryErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  return getRequestErrorMessage(error, fallbackMessage);
};
