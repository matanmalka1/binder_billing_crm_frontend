import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  UserResponse,
  UserListResponse,
  UserAuditLogListResponse,
  ListUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
  ResetPasswordPayload,
  ListAuditLogsParams,
} from "./contracts";

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
