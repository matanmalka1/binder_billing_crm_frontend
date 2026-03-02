import type { ActionCommand, BackendAction } from "./types";

const HIDDEN_ACTION_KEYS = new Set<string>(["freeze", "activate"]);

const mapConfirm = (confirm?: BackendAction["confirm"] | null): ActionCommand["confirm"] => {
  if (!confirm) return undefined;
  return {
    title: confirm.title,
    message: confirm.message,
    confirmLabel: confirm.confirm_label,
    cancelLabel: confirm.cancel_label,
  };
};

export const mapActions = (
  actions: BackendAction[] | null | undefined,
): ActionCommand[] => {
  if (!Array.isArray(actions)) return [];

  return actions
    .filter((action) => !HIDDEN_ACTION_KEYS.has(action.key))
    .map((action) => {
      if (!action.endpoint) return null;

      return {
        key: action.key,
        uiKey: action.id,
        id: action.id,
        label: action.label,
        method: action.method,
        endpoint: action.endpoint,
        payload: action.payload ?? undefined,
        confirm: mapConfirm(action.confirm),
        clientName: action.client_name ?? null,
        binderNumber: action.binder_number ?? null,
      } as ActionCommand;
    })
    .filter((a): a is ActionCommand => Boolean(a));
};
