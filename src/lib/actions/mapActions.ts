import { useAuthStore } from "../../store/auth.store";
import { getActionLabel, isActionAllowed, normalizeActionId } from "./catalog";
import type { ActionCommand, ActionId, BackendAction } from "./types";

const buildConfirm = (action: BackendAction) => {
  const needsConfirm = action.confirm_required === true || action.confirm_message || action.confirm_title;
  if (!needsConfirm) return undefined;
  return {
    title: action.confirm_title || "אישור פעולה",
    message: action.confirm_message || "האם להמשיך?",
    confirmLabel: action.confirm_label || "אישור",
    cancelLabel: action.cancel_label || "ביטול",
  } as const;
};

export const mapActions = (
  actions: BackendAction[] | null | undefined,
  { scopeKey }: { scopeKey?: string } = {},
): ActionCommand[] => {
  if (!Array.isArray(actions)) return [];

  const role = useAuthStore.getState().user?.role ?? null;

  return actions
    .map((action, index) => {
      const id = normalizeActionId(action.key) as ActionId | null;
      if (!isActionAllowed(id, role)) return null;
      if (!action.endpoint) return null;

      const uiKey = `${scopeKey || "action"}-${index}-${action.key}`;

      return {
        key: action.key,
        uiKey,
        id: id ?? "custom",
        label: action.label || getActionLabel(id ?? action.key),
        method: action.method,
        endpoint: action.endpoint,
        payload: action.payload ?? undefined,
        confirm: buildConfirm(action),
      } as ActionCommand;
    })
    .filter((a): a is ActionCommand => Boolean(a));
};
