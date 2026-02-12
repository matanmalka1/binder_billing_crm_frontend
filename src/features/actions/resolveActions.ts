import type {
  ActionConfirmConfig,
  ActionMethod,
  BackendActionInput,
  BackendActionObject,
  ResolvedBackendAction,
} from "./types";
import { resolveContractAction } from "./contractActionMap";
import { getCanonicalActionToken } from "../../services/actionService";

interface ResolveContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  scopeKey?: string;
}

const isActionMethod = (value: unknown): value is ActionMethod => {
  return value === "post" || value === "patch" || value === "put" || value === "delete";
};

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const toEndpoint = (value: unknown) => {
  const text = toText(value);
  return text.length > 0 ? text : null;
};
const toPayload = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
};

const resolveConfirm = (action: BackendActionObject): ActionConfirmConfig | undefined => {
  const needsConfirm =
    action.confirm_required === true || Boolean(action.confirm_message) || Boolean(action.confirm_title);
  if (!needsConfirm) return undefined;
  return {
    title: toText(action.confirm_title) || "אישור פעולה",
    message: toText(action.confirm_message) || "האם להמשיך?",
    confirmLabel: toText(action.confirm_label) || "אישור",
    cancelLabel: toText(action.cancel_label) || "ביטול",
  };
};

const toResolved = (
  base: Omit<ResolvedBackendAction, "endpoint" | "token">,
  token: string,
  endpoint: string | null,
): ResolvedBackendAction | null => {
  if (!endpoint) return null;
  return { ...base, token, endpoint };
};

const resolveObjectAction = (
  action: BackendActionObject,
  index: number,
  context: ResolveContext,
): ResolvedBackendAction | null => {
  const token = toText(action.key || action.action || action.type || action.item_type);
  const contract = resolveContractAction(token || null, action, context);
  const endpoint = getCanonicalActionToken(token)
    ? contract.endpoint
    : toEndpoint(action.endpoint || action.url) || contract.endpoint;
  const baseKey = token || `action-${index}`;
  const uiKey = `${context.scopeKey || "action"}-${index}-${baseKey}`;
  return toResolved(
    {
      key: baseKey,
      uiKey,
      label: toText(action.label) || contract.label,
      method: isActionMethod(action.method) ? action.method : contract.method,
      payload: toPayload(action.payload) || toPayload(action.body) || contract.payload,
      confirm: resolveConfirm(action),
    },
    contract.token,
    endpoint,
  );
};

const resolveStringAction = (
  action: string,
  index: number,
  context: ResolveContext,
): ResolvedBackendAction | null => {
  const token = toText(action) || `action-${index}`;
  const contract = resolveContractAction(token, null, context);
  return toResolved(
    {
      key: token,
      uiKey: `${context.scopeKey || "action"}-${index}-${token}`,
      label: contract.label,
      method: contract.method,
      payload: contract.payload,
    },
    contract.token,
    contract.endpoint,
  );
};

const resolveActions = (
  actions: BackendActionInput[] | null | undefined,
  context: ResolveContext,
): ResolvedBackendAction[] => {
  if (!Array.isArray(actions)) return [];
  return actions
    .map((action, index) => {
      if (typeof action === "string") return resolveStringAction(action, index, context);
      return resolveObjectAction(action, index, context);
    })
    .filter((action): action is ResolvedBackendAction => action !== null);
};

export const resolveStandaloneActions = (
  actions: BackendActionInput[] | null | undefined,
  scopeKey?: string,
): ResolvedBackendAction[] => {
  return resolveActions(actions, { scopeKey });
};

export const resolveEntityActions = (
  actions: BackendActionInput[] | null | undefined,
  entityPath: string,
  entityId: number,
  scopeKey?: string,
): ResolvedBackendAction[] => {
  const ids =
    entityPath === "/binders"
      ? { binderId: entityId }
      : entityPath === "/charges"
        ? { chargeId: entityId }
        : entityPath === "/clients"
          ? { clientId: entityId }
          : {};
  return resolveActions(actions, { ...ids, entityPath, entityId, scopeKey });
};
