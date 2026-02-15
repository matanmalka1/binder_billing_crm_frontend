import { useAuthStore } from "../../store/auth.store";
import { getActionLabel } from "../../utils/enums";
import type { ActionCommand, BackendAction } from "./types";

const ADVISOR_ONLY_KEYS = new Set([
  "freeze",
  "mark_paid",
  "issue_charge",
  "cancel_charge",
]);

const isActionAllowed = (
  actionKey: string,
  role: string | null | undefined,
): boolean => {
  if (!role) return true;
  if (role === "advisor") return true;
  return !ADVISOR_ONLY_KEYS.has(actionKey);
};

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
      if (!isActionAllowed(action.key, role)) return null;
      if (!action.endpoint) return null;

      const uiKey = `${scopeKey || "action"}-${index}-${action.key}`;

      return {
        key: action.key,
        uiKey,
        id: action.key,
        label: action.label || getActionLabel(action.key),
        method: action.method,
        endpoint: action.endpoint,
        payload: action.payload ?? undefined,
        confirm: buildConfirm(action),
      } as ActionCommand;
    })
    .filter((a): a is ActionCommand => Boolean(a));
};
