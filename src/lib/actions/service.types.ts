import type { ActionMethod, CanonicalActionToken } from "./types";

export interface CanonicalActionContext {
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
}

export interface CanonicalActionResolution {
  token: CanonicalActionToken;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
}
