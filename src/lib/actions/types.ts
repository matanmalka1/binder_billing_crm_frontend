export type ActionMethod = "post" | "patch" | "put" | "delete";

export interface BackendActionConfirm {
  title: string;
  message: string;
  confirm_label: string;
  cancel_label: string;
}

export interface BackendAction {
  id: string;
  key: string;
  label: string;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown> | null;
  confirm?: BackendActionConfirm | null;
  binder_id?: number | null;
  charge_id?: number | null;
  client_id?: number | null;
  client_name?: string | null;
  binder_number?: string | null;
}

export type BackendActionInput = BackendAction;

export interface ActionConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export interface ActionCommand {
  key: string;
  uiKey: string;
  id: string;
  label: string;
  method: ActionMethod;
  endpoint: string;
  payload?: Record<string, unknown>;
  confirm?: ActionConfirmConfig;
  clientName?: string | null;
  binderNumber?: string | null;
}
