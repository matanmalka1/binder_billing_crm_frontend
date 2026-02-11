import type { ActionMethod, BackendActionObject } from "./types";

interface ContractContext {
  entityPath?: string;
  entityId?: number;
  binderId?: number | null;
  chargeId?: number | null;
  clientId?: number | null;
}

interface ContractResolved {
  label: string;
  method: ActionMethod;
  endpoint: string | null;
  payload?: Record<string, unknown>;
}

const normalize = (value: string) => value.trim().toLowerCase();

const labels: Record<string, string> = {
  receive: "קליטת תיק",
  receive_binder: "קליטת תיק",
  ready: "מוכן לאיסוף",
  ready_binder: "מוכן לאיסוף",
  return: "החזרת תיק",
  return_binder: "החזרת תיק",
  freeze: "הקפאת לקוח",
  activate: "הפעלת לקוח",
  pay_charge: "סימון חיוב כשולם",
  mark_paid: "סימון חיוב כשולם",
  mark_charge_paid: "סימון חיוב כשולם",
  issue_charge: "הנפקת חיוב",
  cancel_charge: "ביטול חיוב",
  unpaid_charge: "מעבר לחיוב",
  idle_binder: "מעבר לתיק",
  ready_for_pickup: "מעבר לתיק",
};

const resolveBinderId = (action: BackendActionObject | null, context: ContractContext) => {
  return action?.binder_id ?? context.binderId ?? (context.entityPath === "/binders" ? context.entityId : null);
};

const resolveChargeId = (action: BackendActionObject | null, context: ContractContext) => {
  return action?.charge_id ?? context.chargeId ?? (context.entityPath === "/charges" ? context.entityId : null);
};

const resolveClientId = (action: BackendActionObject | null, context: ContractContext) => {
  return action?.client_id ?? context.clientId ?? (context.entityPath === "/clients" ? context.entityId : null);
};

const endpointByToken = (
  token: string,
  action: BackendActionObject | null,
  context: ContractContext,
): Pick<ContractResolved, "endpoint" | "payload"> => {
  const binderId = resolveBinderId(action, context);
  const chargeId = resolveChargeId(action, context);
  const clientId = resolveClientId(action, context);

  if (token === "receive" || token === "receive_binder") {
    return binderId ? { endpoint: "/binders/receive", payload: { binder_id: binderId } } : { endpoint: null };
  }
  if (token === "return" || token === "return_binder") {
    return binderId ? { endpoint: `/binders/${binderId}/return` } : { endpoint: null };
  }
  if (token === "ready" || token === "ready_binder") {
    return binderId ? { endpoint: `/binders/${binderId}/ready` } : { endpoint: null };
  }
  if (token === "pay_charge" || token === "mark_paid" || token === "mark_charge_paid") {
    return chargeId ? { endpoint: `/charges/${chargeId}/mark-paid` } : { endpoint: null };
  }
  if (token === "issue_charge") {
    return chargeId ? { endpoint: `/charges/${chargeId}/issue` } : { endpoint: null };
  }
  if (token === "cancel_charge") {
    return chargeId ? { endpoint: `/charges/${chargeId}/cancel` } : { endpoint: null };
  }
  if (token === "freeze") {
    return clientId ? { endpoint: `/clients/${clientId}`, payload: { status: "frozen" } } : { endpoint: null };
  }
  if (token === "activate") {
    return clientId ? { endpoint: `/clients/${clientId}`, payload: { status: "active" } } : { endpoint: null };
  }
  return { endpoint: null };
};

export const resolveContractAction = (
  rawToken: string | null,
  action: BackendActionObject | null,
  context: ContractContext,
): ContractResolved => {
  const token = rawToken ? normalize(rawToken) : "";
  const { endpoint, payload } = endpointByToken(token, action, context);
  return {
    label: labels[token] || "—",
    method: token === "freeze" || token === "activate" ? "patch" : "post",
    endpoint,
    payload,
  };
};
