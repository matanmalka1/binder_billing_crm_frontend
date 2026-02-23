import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import type { PaginatedResponse } from "../types/common";

// ── Response types ──────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: "advisor" | "secretary";
  is_active: boolean;
  token_version: number;
  created_at: string;
  last_login_at: string | null;
}

export type UserListResponse = PaginatedResponse<UserResponse>;

export interface UserAuditLogResponse {
  id: number;
  action: string;
  actor_user_id: number | null;
  target_user_id: number | null;
  email: string | null;
  status: "success" | "failure";
  reason: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type UserAuditLogListResponse = PaginatedResponse<UserAuditLogResponse>;

// ── Request / payload types ─────────────────────────────────────────────────

export interface ListUsersParams {
  page?: number;
  page_size?: number;
}

export interface CreateUserPayload {
  full_name: string;
  email: string;
  phone?: string | null;
  role: "advisor" | "secretary";
  password: string;
}

export interface UpdateUserPayload {
  full_name?: string;
  phone?: string | null;
  role?: "advisor" | "secretary";
  email?: string;
}

export interface ResetPasswordPayload {
  new_password: string;
}

export interface ListAuditLogsParams {
  page?: number;
  page_size?: number;
  action?: string;
  target_user_id?: number;
  actor_user_id?: number;
  email?: string;
}

// ── API ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  list: async (params: ListUsersParams): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>(ENDPOINTS.users, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (userId: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(ENDPOINTS.userById(userId));
    return response.data;
  },

  create: async (payload: CreateUserPayload): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(ENDPOINTS.users, payload);
    return response.data;
  },

  update: async (userId: number, payload: UpdateUserPayload): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(ENDPOINTS.userById(userId), payload);
    return response.data;
  },

  activate: async (userId: number): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(ENDPOINTS.userActivate(userId));
    return response.data;
  },

  deactivate: async (userId: number): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(ENDPOINTS.userDeactivate(userId));
    return response.data;
  },

  resetPassword: async (userId: number, payload: ResetPasswordPayload): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(ENDPOINTS.userResetPassword(userId), payload);
    return response.data;
  },

  listAuditLogs: async (params: ListAuditLogsParams): Promise<UserAuditLogListResponse> => {
    const response = await api.get<UserAuditLogListResponse>(ENDPOINTS.userAuditLogs, {
      params: toQueryParams(params),
    });
    return response.data;
  },
};
