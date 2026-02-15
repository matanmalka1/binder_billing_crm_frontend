export type ActionMethod = "post" | "patch" | "put" | "delete";

export type ActionId =
  | "receive"
  | "return"
  | "ready"
  | "freeze"
  | "activate"
  | "mark_paid"
  | "issue_charge"
  | "cancel_charge";

export type ActionTokenSourceField =
  | "key"
  | "action"
  | "type"
  | "item_type"
  | "operation";

export const ACTION_TOKEN_SOURCE_FIELDS: readonly ActionTokenSourceField[] = [
  "key",
  "action",
  "type",
  "item_type",
  "operation",
] as const;

export interface BackendActionObject {
  key?: string;
  action?: string;
  type?: string;
  item_type?: string;
  operation?: string;
  label?: string;
  endpoint?: string;
  url?: string;
  method?: string;
  payload?: Record<string, unknown> | null;
  body?: Record<string, unknown> | null;
  binder_id?: number | null;
  charge_id?: number | null;
  client_id?: number | null;
  confirm_required?: boolean;
  confirm_title?: string;
  confirm_message?: string;
  confirm_label?: string;
  cancel_label?: string;
}



export interface BackendQuickAction extends BackendActionObject {
  key: string;
  label: string;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown> | null;
  confirm_required: boolean;
}

export type BackendActionInput = string | BackendActionObject;

export interface ActionConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export interface ActionCommand {
  key: string;
  uiKey: string;
  id: ActionId | "custom";
  label: string;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
  confirm?: ActionConfirmConfig;
}
