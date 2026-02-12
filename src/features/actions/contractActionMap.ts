import type { ActionMethod, BackendActionObject } from "./types";
import {
  getCanonicalActionLabel,
  getCanonicalActionToken,
  resolveCanonicalAction,
} from "../../services/actionService";

interface ContractContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
  payload?: Record<string, unknown>;
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

const resolveBinderId = (
  action: BackendActionObject | null,
  context: ContractContext,
) => {
  return action?.binder_id ?? context.binderId ?? (context.entityPath === "/binders" ? context.entityId : null);
};

const resolveChargeId = (
  action: BackendActionObject | null,
  context: ContractContext,
) => {
  return action?.charge_id ?? context.chargeId ?? (context.entityPath === "/charges" ? context.entityId : null);
};

const resolveClientId = (
  action: BackendActionObject | null,
  context: ContractContext,
) => {
  return action?.client_id ?? context.clientId ?? (context.entityPath === "/clients" ? context.entityId : null);
};

export const resolveContractAction = (
  rawToken: string | null,
  action: BackendActionObject | null,
  context: ContractContext,
): ContractResolved => {
  const canonicalToken = getCanonicalActionToken(rawToken);
  const canonical = resolveCanonicalAction(canonicalToken, {
    binderId: resolveBinderId(action, context),
    chargeId: resolveChargeId(action, context),
    clientId: resolveClientId(action, context),
    payload: action?.payload ?? action?.body ?? context.payload,
  });

  return {
    token: canonical?.token ?? (rawToken?.trim().toLowerCase() || ""),
    label: canonical ? getCanonicalActionLabel(canonical.token) : getCanonicalActionLabel(rawToken),
    method: canonical?.method ?? fallbackMethod(canonicalToken),
    endpoint: canonical?.endpoint ?? null,
    payload: canonical?.payload,
  };
};
