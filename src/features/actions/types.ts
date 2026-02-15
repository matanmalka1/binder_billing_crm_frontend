import type { ReactNode } from "react";
import type { ActionCommand } from "../../lib/actions";

export interface ActionModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

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
