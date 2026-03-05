import axios from "axios";
import type { AxiosError } from "axios";

export const AUTH_EXPIRED_EVENT = "auth:expired";
export const SKIP_AUTH_INTERCEPT_HEADER = "X-Skip-Auth-Intercept";

export const AUTH_STORAGE_KEY = "auth-storage";

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

let authExpiryRefCount = 0;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const skipIntercept =
      error.config?.headers?.[SKIP_AUTH_INTERCEPT_HEADER] === "1";

    if (error.response?.status === 401 && !skipIntercept) {
      authExpiryRefCount += 1;
      if (authExpiryRefCount === 1) {
        clearPersistedAuthState();
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
      // Decrement after this rejection has been processed by all handlers.
      Promise.resolve().then(() => {
        authExpiryRefCount = Math.max(0, authExpiryRefCount - 1);
      });
    }
    return Promise.reject(error);
  },
);

const clearPersistedAuthState = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
};
