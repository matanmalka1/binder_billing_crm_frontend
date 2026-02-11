import React from "react";
import { Modal } from "./Modal";
import { ActionButton } from "./ActionButton";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "ביטול",
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <ActionButton
            type="button"
            variant="secondary"
            label={cancelLabel}
            onClick={onCancel}
            disabled={isConfirming}
          />
          <ActionButton
            type="button"
            label={confirmLabel}
            onClick={onConfirm}
            isLoading={isConfirming}
            disabled={isConfirming}
          />
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
    </Modal>
  );
};
