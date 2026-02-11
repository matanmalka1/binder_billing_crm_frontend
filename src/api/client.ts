import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// Base URL from environment or default
const baseURL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Create axios instance
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export type BinderAction = "receive" | "return";
export type ClientAction = "freeze" | "activate";
export type MutationMethod = "post" | "patch";

export interface DashboardQuickActionRequest {
  endpoint: string;
  method?: MutationMethod;
  payload?: Record<string, unknown>;
}

export const triggerBinderAction = (
  binderId: number,
  action: BinderAction,
) => {
  if (action === "receive") {
    return api.post("/binders/receive", { binder_id: binderId });
  }

  return api.post(`/binders/${binderId}/return`);
};

export const triggerClientAction = (
  clientId: number,
  action: ClientAction,
) => {
  const status = action === "freeze" ? "frozen" : "active";
  return api.patch(`/clients/${clientId}`, { status });
};

export const triggerDashboardQuickAction = (
  action: DashboardQuickActionRequest,
) => {
  return api.request({
    url: action.endpoint,
    method: action.method ?? "post",
    data: action.payload,
  });
};

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
