import type { UserRole } from "../types/common";
import { BACKEND_CONTRACT } from "./backendContract";
import { normalizePath, templateToRegex } from "./pathMatcher";
import type { EndpointContract, HttpMethod } from "./types";

export const findEndpointContract = (
  method: string,
  path: string,
): EndpointContract | null => {
  const normalizedMethod = method.toUpperCase() as HttpMethod;
  const normalizedPath = normalizePath(path);

  for (const endpoint of BACKEND_CONTRACT) {
    if (endpoint.method !== normalizedMethod) continue;
    if (templateToRegex(endpoint.path).test(normalizedPath)) {
      return endpoint;
    }
  }

  return null;
};

export const isAdvisorOnlyEndpoint = (method: string, path: string): boolean => {
  const endpoint = findEndpointContract(method, path);
  return endpoint?.role === "advisor";
};

export const isRoleAllowedForEndpoint = (
  role: UserRole | null | undefined,
  method: string,
  path: string,
): boolean => {
  const endpoint = findEndpointContract(method, path);
  if (!endpoint) return true;
  if (endpoint.role === "public") return true;
  if (!role) return false;
  if (endpoint.role === "advisor") return role === "advisor";
  return role === "advisor" || role === "secretary";
};
