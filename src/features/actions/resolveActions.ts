import type {
  BackendActionInput,
  BackendActionObject,
  ResolvedBackendAction,
} from "./types";
import { getCanonicalActionToken } from "../../services/actionService";
import { resolveContractAction } from "./contractActionMap";
import {
  getEntityIds,
  isAllowedByRole,
  isActionMethod,
  resolveConfirm,
  toEndpoint,
  toPayload,
  toResolvedAction,
  toText,
  type ResolveContext,
} from "./resolveActions.helpers";

const toResolved = (
  base: Omit<ResolvedBackendAction, "endpoint" | "token">,
  token: string,
  endpoint: string | null,
): ResolvedBackendAction | null => {
  if (!endpoint) return null;
  if (!isAllowedByRole(token, base.method, endpoint)) return null;
  return toResolvedAction(base, token, endpoint);
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
