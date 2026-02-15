import { ENDPOINTS } from "./endpoints";
import type { AuthUser } from "../types/store";
import { api } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      ENDPOINTS.authLogin,
      payload,
    );
    return response.data;
  },
};
