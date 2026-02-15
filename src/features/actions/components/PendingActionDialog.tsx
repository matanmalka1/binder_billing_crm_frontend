import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import type { ActionCommand } from "../../../lib/actions/types";

export interface PendingActionDialogProps {
  pendingAction: ActionCommand | null;
  activeActionKey: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PendingActionDialog: React.FC<PendingActionDialogProps> = ({
  pendingAction,
  activeActionKey,
  onConfirm,
  onCancel,
}) => (
  <ConfirmDialog
    open={Boolean(pendingAction)}
    title={pendingAction?.confirm?.title || "אישור פעולה"}
    message={pendingAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
    confirmLabel={pendingAction?.confirm?.confirmLabel || "אישור"}
    cancelLabel={pendingAction?.confirm?.cancelLabel || "ביטול"}
    isLoading={activeActionKey === pendingAction?.uiKey}
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
);
