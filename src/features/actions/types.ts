import type { ActionCommand } from "../../lib/actions/types";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface PendingActionDialogProps {
  pendingAction: ActionCommand | null;
  activeActionKey: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}
