import { getRequestErrorMessage } from "./utils";

export const resolveQueryErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  return getRequestErrorMessage(error, fallbackMessage);
};
