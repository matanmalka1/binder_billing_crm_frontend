import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import type { AuthUser } from "../types/common";

export const parseStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed?.id === "number" &&
      typeof parsed?.full_name === "string" &&
      (parsed?.role === "advisor" || parsed?.role === "secretary")
    ) {
      return {
        id: parsed.id,
        full_name: parsed.full_name,
        role: parsed.role,
      };
    }
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }

  return null;
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
export const storedUser = parseStoredUser();
