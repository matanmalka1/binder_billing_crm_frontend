import { isAdvisorOnlyEndpoint } from "../../contracts/guards";
import { useAuthStore } from "../../store/auth.store";
import {
  getActionLabel,
  isActionAllowed,
  normalizeActionId,
  resolveCanonicalAction,
} from "./catalog";
import type {
  ActionCommand,
  ActionConfirmConfig,
  ActionId,
  ActionMethod,
  ActionTokenSourceField,
  BackendActionInput,
  BackendActionObject,
} from "./types";
import { ACTION_TOKEN_SOURCE_FIELDS } from "./types";

export interface ResolveContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
  scopeKey?: string;
}

export interface NormalizedIncomingAction {
  rawToken: string | null;
  tokenSourceField: ActionTokenSourceField | "string" | null;
  key: string;
  uiKey: string;
  label: string | null;
  explicitEndpoint: string | null;
  method: ActionMethod | null;
  payload?: Record<string, unknown>;
  confirm?: ActionConfirmConfig;
  binderId: number | null;
  chargeId: number | null;
  clientId: number | null;
}

const DEFAULT_SCOPE_KEY = "action";

const ENTITY_CONTEXT_KEYS = {
  "/binders": "binderId",
  "/charges": "chargeId",
  "/clients": "clientId",
} as const;

type EntityPath = keyof typeof ENTITY_CONTEXT_KEYS;

const fallbackMethod = (actionId: ActionId | null): ActionMethod => {
  return actionId === "freeze" || actionId === "activate" ? "patch" : "post";
};

const isActionMethod = (value: unknown): value is ActionMethod => {
  return value === "post" || value === "patch" || value === "put" || value === "delete";
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const toEndpoint = (value: unknown): string | null => {
  const text = toText(value);
  return text.length > 0 ? text : null;
};

const toPayload = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
};

const resolveConfirm = (
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

const isEntityPath = (value: string): value is EntityPath => value in ENTITY_CONTEXT_KEYS;

const getEntityIds = (entityPath: string, entityId: number): ResolveContext => {
  if (!isEntityPath(entityPath)) return {};

  const contextKey = ENTITY_CONTEXT_KEYS[entityPath];
  return { [contextKey]: entityId };
};

const buildUiKey = (index: number, baseKey: string, scopeKey?: string): string => {
  return `${scopeKey || DEFAULT_SCOPE_KEY}-${index}-${baseKey}`;
};

const extractTokenFromAction = (
  action: BackendActionObject,
): { token: string | null; sourceField: ActionTokenSourceField | null } => {
  for (const field of ACTION_TOKEN_SOURCE_FIELDS) {
    const value = toText(action[field]);
    if (value) {
      return { token: value, sourceField: field };
    }
  }

  return { token: null, sourceField: null };
};

const normalizeEntityIds = (
  action: BackendActionObject | null,
  context: ResolveContext,
): { binderId: number | null; chargeId: number | null; clientId: number | null } => {
  const entityPath = context.entityPath && isEntityPath(context.entityPath) ? context.entityPath : null;
  const fallbackEntityId = context.entityId ?? null;
  const binderId =
    action?.binder_id ??
    context.binderId ??
    (entityPath === "/binders" ? fallbackEntityId : null);
  const chargeId =
    action?.charge_id ??
    context.chargeId ??
    (entityPath === "/charges" ? fallbackEntityId : null);
  const clientId =
    action?.client_id ??
    context.clientId ??
    (entityPath === "/clients" ? fallbackEntityId : null);

  return { binderId, chargeId, clientId };
};

const normalizeBackendAction = (
  input: BackendActionInput,
  index: number,
  context: ResolveContext,
): NormalizedIncomingAction => {
  if (typeof input === "string") {
    const token = toText(input) || null;
    const baseKey = token || `action-${index}`;
    const ids = normalizeEntityIds(null, context);

    return {
      rawToken: token,
      tokenSourceField: "string",
      key: baseKey,
      uiKey: buildUiKey(index, baseKey, context.scopeKey),
      label: null,
      explicitEndpoint: null,
      method: null,
      payload: context.payload,
      binderId: ids.binderId,
      chargeId: ids.chargeId,
      clientId: ids.clientId,
    };
  }

  const { token, sourceField } = extractTokenFromAction(input);
  const baseKey = token || `action-${index}`;
  const payload = toPayload(input.payload) || toPayload(input.body) || context.payload;
  const ids = normalizeEntityIds(input, context);

  return {
    rawToken: token,
    tokenSourceField: sourceField,
    key: baseKey,
    uiKey: buildUiKey(index, baseKey, context.scopeKey),
    label: toText(input.label) || null,
    explicitEndpoint: toEndpoint(input.endpoint || input.url),
    method: isActionMethod(input.method) ? input.method : null,
    payload,
    confirm: resolveConfirm(input),
    binderId: ids.binderId,
    chargeId: ids.chargeId,
    clientId: ids.clientId,
  };
};

const materializeAction = (
  normalized: NormalizedIncomingAction,
): ActionCommand | null => {
  const actionId = normalizeActionId(normalized.rawToken);
  const canonical = resolveCanonicalAction(actionId, {
    binderId: normalized.binderId,
    chargeId: normalized.chargeId,
    clientId: normalized.clientId,
    payload: normalized.payload,
  });

  const hasCanonical = actionId !== null;
  const endpoint = hasCanonical ? canonical?.endpoint ?? null : normalized.explicitEndpoint || null;
  if (!hasCanonical && !endpoint && normalized.rawToken && import.meta.env.DEV) {
    console.warn(
      `[actions] Dropping unresolved action token "${normalized.rawToken}" (source: ${normalized.tokenSourceField ?? "unknown"}).`,
    );
  }

  if (!endpoint) return null;

  const role = useAuthStore.getState().user?.role;
  if (!isActionAllowed(actionId, role)) return null;

  const method = normalized.method ?? canonical?.method ?? fallbackMethod(actionId);
  if (role === "secretary" && isAdvisorOnlyEndpoint(method.toUpperCase(), endpoint)) {
    return null;
  }

  return {
    key: normalized.key,
    uiKey: normalized.uiKey,
    id: canonical?.id ?? "custom",
    label: normalized.label || getActionLabel(canonical?.id ?? actionId),
    method,
    endpoint,
    payload: normalized.payload ?? canonical?.payload,
    confirm: normalized.confirm,
  };
};

const resolveActions = (
  actions: BackendActionInput[] | null | undefined,
  context: ResolveContext,
): ActionCommand[] => {
  if (!Array.isArray(actions)) return [];

  return actions
    .map((action, index) => {
      const normalized = normalizeBackendAction(action, index, context);
      return materializeAction(normalized);
    })
    .filter((action): action is ActionCommand => action !== null);
};

export const resolveStandaloneActions = (
  actions: BackendActionInput[] | null | undefined,
  scopeKey?: string,
): ActionCommand[] => resolveActions(actions, { scopeKey });

export const resolveEntityActions = (
  actions: BackendActionInput[] | null | undefined,
  entityPath: string,
  entityId: number,
  scopeKey?: string,
): ActionCommand[] => {
  return resolveActions(actions, {
    ...getEntityIds(entityPath, entityId),
    entityPath,
    entityId,
    scopeKey,
  });
};
