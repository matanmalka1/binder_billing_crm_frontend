import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import type { ResolvedBackendAction } from "../types";

interface PendingActionDialogProps {
  pendingAction: ResolvedBackendAction | null;
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
