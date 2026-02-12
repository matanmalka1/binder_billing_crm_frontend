import { isAdvisorOnlyEndpoint } from "../../contracts/backendContract";
import { useAuthStore } from "../../store/auth.store";
import type {
  ActionConfirmConfig,
  ActionMethod,
  ActionTokenSourceField,
  BackendActionInput,
  BackendActionObject,
  ResolvedBackendAction,
} from "./types";
import { ACTION_TOKEN_SOURCE_FIELDS } from "./types";
import {
  getCanonicalActionLabel,
  getCanonicalActionToken,
  isActionAllowedForRole,
  resolveCanonicalAction,
} from "./service";

export interface ResolveContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
  scopeKey?: string;
}

export interface NormalizedActionInput {
  index: number;
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

interface ContractResolved {
  label: string;
  method: ActionMethod;
  endpoint: string | null;
  payload?: Record<string, unknown>;
  token: string;
}

const fallbackMethod = (token: string | null): ActionMethod => {
  return token === "freeze" || token === "activate" ? "patch" : "post";
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

const getEntityIds = (entityPath: string, entityId: number): ResolveContext => {
  if (entityPath === "/binders") return { binderId: entityId };
  if (entityPath === "/charges") return { chargeId: entityId };
  if (entityPath === "/clients") return { clientId: entityId };
  return {};
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
  const binderId =
    action?.binder_id ?? context.binderId ?? (context.entityPath === "/binders" ? context.entityId ?? null : null);
  const chargeId =
    action?.charge_id ?? context.chargeId ?? (context.entityPath === "/charges" ? context.entityId ?? null : null);
  const clientId =
    action?.client_id ?? context.clientId ?? (context.entityPath === "/clients" ? context.entityId ?? null : null);

  return { binderId, chargeId, clientId };
};

export const normalizeBackendAction = (
  input: BackendActionInput,
  index: number,
  context: ResolveContext,
): NormalizedActionInput => {
  if (typeof input === "string") {
    const token = toText(input) || null;
    const baseKey = token || `action-${index}`;
    const ids = normalizeEntityIds(null, context);

    return {
      index,
      rawToken: token,
      tokenSourceField: "string",
      key: baseKey,
      uiKey: `${context.scopeKey || "action"}-${index}-${baseKey}`,
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
    index,
    rawToken: token,
    tokenSourceField: sourceField,
    key: baseKey,
    uiKey: `${context.scopeKey || "action"}-${index}-${baseKey}`,
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

export const resolveContractAction = (
  rawToken: string | null,
  action: BackendActionObject | null,
  context: ResolveContext,
): ContractResolved => {
  const ids = normalizeEntityIds(action, context);
  const payload = action ? (toPayload(action.payload) || toPayload(action.body) || context.payload) : context.payload;
  const canonicalToken = getCanonicalActionToken(rawToken);
  const canonical = resolveCanonicalAction(canonicalToken, {
    binderId: ids.binderId,
    chargeId: ids.chargeId,
    clientId: ids.clientId,
    payload,
  });

  return {
    token: canonical?.token ?? (rawToken?.trim().toLowerCase() || ""),
    label: canonical ? getCanonicalActionLabel(canonical.token) : getCanonicalActionLabel(rawToken),
    method: canonical?.method ?? fallbackMethod(canonicalToken),
    endpoint: canonical?.endpoint ?? null,
    payload: canonical?.payload,
  };
};

const resolveCanonicalFromNormalized = (
  normalized: NormalizedActionInput,
): ContractResolved => {
  const contract = resolveContractAction(normalized.rawToken, null, {
    binderId: normalized.binderId,
    chargeId: normalized.chargeId,
    clientId: normalized.clientId,
    payload: normalized.payload,
  });

  const hasCanonical = getCanonicalActionToken(normalized.rawToken) !== null;
  const endpoint = hasCanonical ? contract.endpoint : normalized.explicitEndpoint || contract.endpoint;
  if (!hasCanonical && !endpoint && normalized.rawToken && import.meta.env.DEV) {
    console.warn(
      `[actions] Dropping unresolved action token "${normalized.rawToken}" (source: ${normalized.tokenSourceField ?? "unknown"}).`,
    );
  }

  return {
    token: contract.token,
    label: contract.label,
    method: normalized.method ?? contract.method,
    endpoint,
    payload: normalized.payload ?? contract.payload,
  };
};

export const materializeResolvedAction = (
  normalized: NormalizedActionInput,
  resolved: ContractResolved,
): ResolvedBackendAction | null => {
  if (!resolved.endpoint) return null;

  const role = useAuthStore.getState().user?.role;
  if (!isActionAllowedForRole(resolved.token, role)) return null;
  if (role === "secretary" && isAdvisorOnlyEndpoint(resolved.method.toUpperCase(), resolved.endpoint)) {
    return null;
  }

  return {
    key: normalized.key,
    uiKey: normalized.uiKey,
    token: resolved.token,
    label: normalized.label || resolved.label,
    method: resolved.method,
    endpoint: resolved.endpoint,
    payload: resolved.payload,
    confirm: normalized.confirm,
  };
};

const resolveActions = (
  actions: BackendActionInput[] | null | undefined,
  context: ResolveContext,
): ResolvedBackendAction[] => {
  if (!Array.isArray(actions)) return [];

  return actions
    .map((action, index) => {
      const normalized = normalizeBackendAction(action, index, context);
      const resolved = resolveCanonicalFromNormalized(normalized);
      return materializeResolvedAction(normalized, resolved);
    })
    .filter((action): action is ResolvedBackendAction => action !== null);
};

export const resolveStandaloneActions = (
  actions: BackendActionInput[] | null | undefined,
  scopeKey?: string,
): ResolvedBackendAction[] => resolveActions(actions, { scopeKey });

export const resolveEntityActions = (
  actions: BackendActionInput[] | null | undefined,
  entityPath: string,
  entityId: number,
  scopeKey?: string,
): ResolvedBackendAction[] => {
  return resolveActions(actions, {
    ...getEntityIds(entityPath, entityId),
    entityPath,
    entityId,
    scopeKey,
  });
};
