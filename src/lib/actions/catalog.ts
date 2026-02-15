import type { UserRole } from "../../types/store";
import { ENDPOINTS } from "../../contracts/endpoints";
import type { ActionId, ActionMethod } from "./types";

export interface CanonicalActionContext {
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
}

export interface CanonicalActionResolution {
  id: ActionId;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
}

export const TOKEN_ALIASES: Record<string, ActionId> = {
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

export const ACTION_LABELS: Record<ActionId, string> = {
  receive: "קליטת תיק",
  ready: "מוכן לאיסוף",
  return: "החזרת תיק",
  freeze: "הקפאת לקוח",
  activate: "הפעלת לקוח",
  mark_paid: "סימון חיוב כשולם",
  issue_charge: "הנפקת חיוב",
  cancel_charge: "ביטול חיוב",
};

export const ADVISOR_ONLY_ACTIONS = new Set<ActionId>([
  "freeze",
  "mark_paid",
  "issue_charge",
  "cancel_charge",
]);

const isEntityId = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

const isNonEmptyText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const hasValidReceivePayload = (
  payload?: Record<string, unknown>,
): payload is Record<string, unknown> & { client_id: number; binder_number: string } => {
  const clientId = payload?.client_id;
  const binderNumber = payload?.binder_number;
  return isEntityId(typeof clientId === "number" ? clientId : null) && isNonEmptyText(binderNumber);
};

const resolvePostById = (
  actionId: ActionId,
  id: number | null | undefined,
  endpointFactory: (entityId: number) => string,
): CanonicalActionResolution | null => {
  return isEntityId(id) ? { id: actionId, method: "post", endpoint: endpointFactory(id) } : null;
};

const resolveClientStatusAction = (
  actionId: "freeze" | "activate",
  clientId: number | null | undefined,
  payload: Record<string, unknown> | undefined,
): CanonicalActionResolution | null => {
  if (!isEntityId(clientId)) return null;

  return {
    id: actionId,
    method: "patch",
    endpoint: ENDPOINTS.clientById(clientId),
    payload: { ...payload, status: actionId === "freeze" ? "frozen" : "active" },
  };
};

export const normalizeActionId = (
  rawToken: string | null | undefined,
): ActionId | null => {
  if (!rawToken) return null;
  return TOKEN_ALIASES[rawToken.trim().toLowerCase()] ?? null;
};

export const isActionAllowed = (
  actionId: ActionId | null,
  role: UserRole | null | undefined,
): boolean => {
  if (!actionId) return true;
  if (!role) return true;
  if (role === "advisor") return true;
  return !ADVISOR_ONLY_ACTIONS.has(actionId);
};

export const getActionLabel = (
  actionIdOrRawToken: ActionId | string | null | undefined,
): string => {
  const actionId =
    typeof actionIdOrRawToken === "string"
      ? normalizeActionId(actionIdOrRawToken)
      : actionIdOrRawToken;
  return actionId ? ACTION_LABELS[actionId] : "—";
};

export const resolveCanonicalAction = (
  actionId: ActionId | null,
  context: CanonicalActionContext,
): CanonicalActionResolution | null => {
  if (!actionId) return null;

  switch (actionId) {
    case "receive":
      return hasValidReceivePayload(context.payload)
        ? { id: actionId, method: "post", endpoint: ENDPOINTS.binderReceive, payload: context.payload }
        : null;
    case "ready":
      return resolvePostById(actionId, context.binderId, ENDPOINTS.binderReady);
    case "return":
      return resolvePostById(actionId, context.binderId, ENDPOINTS.binderReturn);
    case "freeze":
      return resolveClientStatusAction(actionId, context.clientId, context.payload);
    case "activate":
      return resolveClientStatusAction(actionId, context.clientId, context.payload);
    case "mark_paid":
      return resolvePostById(actionId, context.chargeId, ENDPOINTS.chargeMarkPaid);
    case "issue_charge":
      return resolvePostById(actionId, context.chargeId, ENDPOINTS.chargeIssue);
    case "cancel_charge":
      return resolvePostById(actionId, context.chargeId, ENDPOINTS.chargeCancel);
  }
};
