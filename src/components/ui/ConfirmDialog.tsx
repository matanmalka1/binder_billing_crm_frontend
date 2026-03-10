import { Button } from "./Button";
import { Modal } from "./Modal";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
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
  children,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel || "—"}
          </Button>
          <Button
            type="button"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel || "—"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
      {children}
    </Modal>
  );
};
