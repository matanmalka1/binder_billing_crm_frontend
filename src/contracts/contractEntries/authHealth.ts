import { ENDPOINTS } from "../endpoints";
import type { EndpointContract } from "../types";

export const AUTH_HEALTH_CONTRACT_ENTRIES: EndpointContract[] = [
  { key: "health", method: "GET", path: ENDPOINTS.health, role: "public" },
  { key: "info", method: "GET", path: ENDPOINTS.info, role: "public" },
  { key: "auth.login", method: "POST", path: ENDPOINTS.authLogin, role: "public" },
];
