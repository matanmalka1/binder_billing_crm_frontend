import { api } from "../api/client";
import type { ActionMethod, CanonicalActionToken } from "../features/actions/types";

interface CanonicalActionContext {
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
}

interface CanonicalActionResolution {
  token: CanonicalActionToken;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
}

const TOKEN_ALIASES: Record<string, CanonicalActionToken> = {
  receive: "receive",
  receive_binder: "receive",
  ready: "ready",
  ready_binder: "ready",
  return: "return",
  return_binder: "return",
  freeze: "freeze",
  activate: "activate",
  mark_paid: "mark_paid",
  pay_charge: "mark_paid",
  mark_charge_paid: "mark_paid",
  issue_charge: "issue_charge",
  cancel_charge: "cancel_charge",
};

const ACTION_LABELS: Record<CanonicalActionToken, string> = {
  receive: "קליטת תיק",
  ready: "מוכן לאיסוף",
  return: "החזרת תיק",
  freeze: "הקפאת לקוח",
  activate: "הפעלת לקוח",
  mark_paid: "סימון חיוב כשולם",
  issue_charge: "הנפקת חיוב",
  cancel_charge: "ביטול חיוב",
};

const isEntityId = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;
const isNonEmptyText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const hasValidReceivePayload = (
  payload?: Record<string, unknown>,
): payload is Record<string, unknown> & { client_id: number; binder_number: string } => {
  const clientId = payload?.client_id;
  const binderNumber = payload?.binder_number;
  return typeof clientId === "number" && Number.isInteger(clientId) && clientId > 0 && isNonEmptyText(binderNumber);
};

export const getCanonicalActionToken = (rawToken: string | null | undefined): CanonicalActionToken | null => {
  if (!rawToken) return null;
  return TOKEN_ALIASES[rawToken.trim().toLowerCase()] ?? null;
};

export const getCanonicalActionLabel = (rawToken: string | null | undefined): string => {
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
        ? { token, method: "post", endpoint: "/binders/receive", payload: context.payload }
        : null;
    case "ready":
      return isEntityId(context.binderId) ? { token, method: "post", endpoint: `/binders/${context.binderId}/ready` } : null;
    case "return":
      return isEntityId(context.binderId) ? { token, method: "post", endpoint: `/binders/${context.binderId}/return` } : null;
    case "freeze":
      return isEntityId(context.clientId)
        ? { token, method: "patch", endpoint: `/clients/${context.clientId}`, payload: { ...context.payload, status: "frozen" } }
        : null;
    case "activate":
      return isEntityId(context.clientId)
        ? { token, method: "patch", endpoint: `/clients/${context.clientId}`, payload: { ...context.payload, status: "active" } }
        : null;
    case "mark_paid":
      return isEntityId(context.chargeId) ? { token, method: "post", endpoint: `/charges/${context.chargeId}/mark-paid` } : null;
    case "issue_charge":
      return isEntityId(context.chargeId) ? { token, method: "post", endpoint: `/charges/${context.chargeId}/issue` } : null;
    case "cancel_charge":
      return isEntityId(context.chargeId) ? { token, method: "post", endpoint: `/charges/${context.chargeId}/cancel` } : null;
  }
};

export const validateActionBeforeRequest = (request: {
  token?: string;
  endpoint: string;
  payload?: Record<string, unknown>;
}) => {
  const canonicalToken = getCanonicalActionToken(request.token);
  const isReceiveAction = canonicalToken === "receive" || request.endpoint === "/binders/receive";
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
