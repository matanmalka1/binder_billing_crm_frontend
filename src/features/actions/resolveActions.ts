import type {
  ActionConfirmConfig,
  ActionMethod,
  BackendActionInput,
  BackendActionObject,
  ResolvedBackendAction,
} from "./types";
import { resolveContractAction } from "./contractActionMap";

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

const resolveConfirm = (action: BackendActionObject): ActionConfirmConfig | undefined => {
  if (!action.confirm_message && !action.confirm_title) return undefined;
  return {
    title: toText(action.confirm_title) || "אישור פעולה",
    message: toText(action.confirm_message) || "האם להמשיך?",
    confirmLabel: toText(action.confirm_label) || "אישור",
    cancelLabel: toText(action.cancel_label) || "ביטול",
  };
};

const resolveObjectAction = (
  action: BackendActionObject,
  index: number,
  context: ResolveContext,
): ResolvedBackendAction => {
  const token = toText(action.key || action.action || action.type || action.item_type);
  const contract = resolveContractAction(token || null, action, context);
  const baseKey = token || `action-${index}`;
  const uiKey = `${context.scopeKey || "action"}-${index}-${baseKey}`;
  return {
    key: baseKey,
    uiKey,
    label: toText(action.label) || contract.label,
    method: isActionMethod(action.method) ? action.method : contract.method,
    endpoint: toEndpoint(action.endpoint || action.url) || contract.endpoint,
    payload: action.payload || action.body || contract.payload,
    confirm: resolveConfirm(action),
  };
};

const resolveStringAction = (
  action: string,
  index: number,
  context: ResolveContext,
): ResolvedBackendAction => {
  const token = toText(action) || `action-${index}`;
  const contract = resolveContractAction(token, null, context);
  return {
    key: token,
    uiKey: `${context.scopeKey || "action"}-${index}-${token}`,
    label: contract.label,
    method: contract.method,
    endpoint: contract.endpoint,
    payload: contract.payload,
  };
};

const resolveActions = (
  actions: BackendActionInput[] | null | undefined,
  context: ResolveContext,
): ResolvedBackendAction[] => {
  if (!Array.isArray(actions)) return [];
  return actions.map((action, index) => {
    if (typeof action === "string") return resolveStringAction(action, index, context);
    return resolveObjectAction(action, index, context);
  });
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
