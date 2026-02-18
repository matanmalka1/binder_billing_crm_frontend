import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "../api/client";
import type { AuthUser } from "../types/store";

export const parseStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }

  return null;
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const storedToken =
  localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
  sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
export const storedUser = parseStoredUser();
