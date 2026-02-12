import type {
  ActionConfirmConfig,
  ActionMethod,
  BackendActionObject,
  ResolvedBackendAction,
} from "./types";
import { isAdvisorOnlyEndpoint } from "../../contracts/backendContract";
import { useAuthStore } from "../../store/auth.store";
import { isActionAllowedForRole } from "../../services/actionService";

export interface ResolveContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  scopeKey?: string;
}

export const isActionMethod = (value: unknown): value is ActionMethod => {
  return value === "post" || value === "patch" || value === "put" || value === "delete";
};

export const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const toEndpoint = (value: unknown): string | null => {
  const text = toText(value);
  return text.length > 0 ? text : null;
};

export const toPayload = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
};

export const resolveConfirm = (
  action: BackendActionObject,
): ActionConfirmConfig | undefined => {
  const needsConfirm =
    action.confirm_required === true ||
    Boolean(action.confirm_message) ||
    Boolean(action.confirm_title);
  if (!needsConfirm) return undefined;
  return {
    title: toText(action.confirm_title) || "אישור פעולה",
    message: toText(action.confirm_message) || "האם להמשיך?",
    confirmLabel: toText(action.confirm_label) || "אישור",
    cancelLabel: toText(action.cancel_label) || "ביטול",
  };
};

export const getEntityIds = (entityPath: string, entityId: number): ResolveContext => {
  if (entityPath === "/binders") return { binderId: entityId };
  if (entityPath === "/charges") return { chargeId: entityId };
  if (entityPath === "/clients") return { clientId: entityId };
  return {};
};

export const toResolvedAction = (
  base: Omit<ResolvedBackendAction, "endpoint" | "token">,
  token: string,
  endpoint: string,
): ResolvedBackendAction => ({ ...base, token, endpoint });

export const isAllowedByRole = (
  token: string,
  method: ActionMethod,
  endpoint: string,
): boolean => {
  const role = useAuthStore.getState().user?.role;
  if (!isActionAllowedForRole(token, role)) return false;
  return !(role === "secretary" && isAdvisorOnlyEndpoint(method.toUpperCase(), endpoint));
};
