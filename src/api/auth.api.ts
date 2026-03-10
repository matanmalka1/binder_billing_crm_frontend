import { ENDPOINTS } from "./endpoints";
import type { AuthUser } from "../types/store";
import { api, SKIP_AUTH_INTERCEPT_HEADER } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token?: string;
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

  logout: async (): Promise<void> => {
    // skipAuthInterceptor tells the Axios interceptor not to fire AUTH_EXPIRED_EVENT
    // on a 401 during logout — the session is already being torn down intentionally.
    await api.post(ENDPOINTS.authLogout, undefined, {
      headers: { [SKIP_AUTH_INTERCEPT_HEADER]: "1" },
    });
  },
};