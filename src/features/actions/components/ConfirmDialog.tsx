import React from "react";
import { ActionButton } from "./ActionButton";
import { ActionModal } from "./ActionModal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <ActionModal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <ActionButton
            type="button"
            variant="secondary"
            label={cancelLabel}
            disabled={isLoading}
            onClick={onCancel}
          />
          <ActionButton
            type="button"
            label={confirmLabel}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onConfirm}
          />
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
    </ActionModal>
  );
};
