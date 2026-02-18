import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export const AUTH_EXPIRED_EVENT = "auth:expired";

const AUTH_PERSIST_STORAGE_KEY = "auth-storage";

const baseURL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = readAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isHandlingAuthExpiry = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isHandlingAuthExpiry) {
      isHandlingAuthExpiry = true;
      clearStoredTokens();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));

      setTimeout(() => {
        isHandlingAuthExpiry = false;
      }, 5000);
    }
    return Promise.reject(error);
  },
);

const readAuthToken = (): string | null => {
  try {
    const persisted =
      localStorage.getItem(AUTH_PERSIST_STORAGE_KEY) ??
      sessionStorage.getItem(AUTH_PERSIST_STORAGE_KEY);
    if (!persisted) return null;
    const parsed = JSON.parse(persisted);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem(AUTH_PERSIST_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  try {
    sessionStorage.removeItem(AUTH_PERSIST_STORAGE_KEY);
  } catch {
    /* ignore */
  }
};