import type { AuthState } from "./auth.types";

export const selectIsAuthenticated = (state: AuthState) =>
  state.user !== null;
