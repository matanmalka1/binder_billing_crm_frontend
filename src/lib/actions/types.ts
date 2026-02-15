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

export interface BackendAction {
  key: string;
  label?: string;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown> | null;
  confirm_required?: boolean;
  confirm_title?: string;
  confirm_message?: string;
  confirm_label?: string;
  cancel_label?: string;
  binder_id?: number | null;
  charge_id?: number | null;
  client_id?: number | null;
}

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
