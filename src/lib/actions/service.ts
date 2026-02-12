import { api } from "../../api/client";
import type { UserRole } from "../../types/common";
import { ENDPOINTS } from "../../contracts/backendContract";
import type { ActionMethod, CanonicalActionToken } from "./types";
import {
  ACTION_LABELS,
  ADVISOR_ONLY_ACTIONS,
  TOKEN_ALIASES,
} from "./service.constants";
import type {
  CanonicalActionContext,
  CanonicalActionResolution,
} from "./service.types";
import { hasValidReceivePayload, isEntityId } from "./service.validators";

export const getCanonicalActionToken = (
  rawToken: string | null | undefined,
): CanonicalActionToken | null => {
  if (!rawToken) return null;
  return TOKEN_ALIASES[rawToken.trim().toLowerCase()] ?? null;
};

export const isActionAllowedForRole = (
  rawToken: string | null | undefined,
  role: UserRole | null | undefined,
): boolean => {
  const token = getCanonicalActionToken(rawToken);
  if (!token) return true;
  if (!role) return true;
  if (role === "advisor") return true;
  return !ADVISOR_ONLY_ACTIONS.has(token);
};

export const getCanonicalActionLabel = (
  rawToken: string | null | undefined,
): string => {
  const token = getCanonicalActionToken(rawToken);
  return token ? ACTION_LABELS[token] : "—";
};

export const resolveCanonicalAction = (
  rawToken: string | null | undefined,
  context: CanonicalActionContext,
): CanonicalActionResolution | null => {
  const token = getCanonicalActionToken(rawToken);
  if (!token) return null;

  switch (token) {
    case "receive":
      return hasValidReceivePayload(context.payload)
        ? { token, method: "post", endpoint: ENDPOINTS.binderReceive, payload: context.payload }
        : null;
    case "ready":
      return isEntityId(context.binderId)
        ? { token, method: "post", endpoint: ENDPOINTS.binderReady(context.binderId) }
        : null;
    case "return":
      return isEntityId(context.binderId)
        ? { token, method: "post", endpoint: ENDPOINTS.binderReturn(context.binderId) }
        : null;
    case "freeze":
      return isEntityId(context.clientId)
        ? {
            token,
            method: "patch",
            endpoint: ENDPOINTS.clientById(context.clientId),
            payload: { ...context.payload, status: "frozen" },
          }
        : null;
    case "activate":
      return isEntityId(context.clientId)
        ? {
            token,
            method: "patch",
            endpoint: ENDPOINTS.clientById(context.clientId),
            payload: { ...context.payload, status: "active" },
          }
        : null;
    case "mark_paid":
      return isEntityId(context.chargeId)
        ? { token, method: "post", endpoint: ENDPOINTS.chargeMarkPaid(context.chargeId) }
        : null;
    case "issue_charge":
      return isEntityId(context.chargeId)
        ? { token, method: "post", endpoint: ENDPOINTS.chargeIssue(context.chargeId) }
        : null;
    case "cancel_charge":
      return isEntityId(context.chargeId)
        ? { token, method: "post", endpoint: ENDPOINTS.chargeCancel(context.chargeId) }
        : null;
  }

  return null;
};

export const validateActionBeforeRequest = (request: {
  token?: string;
  endpoint: string;
  payload?: Record<string, unknown>;
}) => {
  const canonicalToken = getCanonicalActionToken(request.token);
  const isReceiveAction =
    canonicalToken === "receive" || request.endpoint === ENDPOINTS.binderReceive;
  if (isReceiveAction && !hasValidReceivePayload(request.payload)) {
    throw new Error("פעולת קליטת תיק דורשת client_id ו-binder_number");
  }
};

export const executeApiAction = (request: {
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
}) =>
  api.request({
    url: request.endpoint,
    method: request.method,
    data: request.payload,
  });
