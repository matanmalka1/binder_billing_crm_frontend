import { API_BASE_PATH } from "./endpoints";

export const normalizePath = (path: string): string => {
  if (!path) return "/";
  if (path.startsWith(API_BASE_PATH)) {
    return path.slice(API_BASE_PATH.length) || "/";
  }
  return path;
};

export const templateToRegex = (template: string): RegExp => {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const dynamic = escaped.replace(/\\\{[^}]+\\\}/g, "[^/]+");
  return new RegExp(`^${dynamic}$`);
};
