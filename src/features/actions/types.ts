export type ActionMethod = "post" | "patch" | "put" | "delete";

export interface BackendActionObject {
  key?: string;
  action?: string;
  type?: string;
  item_type?: string;
  label?: string;
  endpoint?: string;
  url?: string;
  method?: string;
  payload?: Record<string, unknown> | null;
  body?: Record<string, unknown> | null;
  binder_id?: number | null;
  charge_id?: number | null;
  client_id?: number | null;
  confirm_title?: string;
  confirm_message?: string;
  confirm_label?: string;
  cancel_label?: string;
}

export type BackendActionInput = string | BackendActionObject;

export interface ActionConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export interface ResolvedBackendAction {
  key: string;
  uiKey: string;
  label: string;
  method: ActionMethod;
  endpoint: string | null;
  payload?: Record<string, unknown>;
  confirm?: ActionConfirmConfig;
}
