import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import type { ActionInputField } from "../../lib/actions/types";
import { cn } from "../../utils/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  inputs?: ActionInputField[];
  onConfirm: (inputValues?: Record<string, string>) => void;
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
  inputs,
  onConfirm,
  onCancel,
  children,
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setInputValues({});
  }, [open]);

  const isConfirmDisabled =
    isLoading ||
    (inputs ?? []).some((f) => f.required && !inputValues[f.name]?.trim());

  const handleConfirm = () => {
    onConfirm(inputs?.length ? inputValues : undefined);
  };

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
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {confirmLabel || "—"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
      {inputs && inputs.length > 0 && (
        <div className="mt-3 space-y-3">
          {inputs.map((field) => (
            <div key={field.name} className="w-full space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 mr-1">*</span>}
              </label>
              <input
                type={field.type}
                value={inputValues[field.name] ?? ""}
                onChange={(e) =>
                  setInputValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                className={cn(
                  "w-full rounded-lg border px-3 py-3 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm bg-white border-gray-300",
                )}
              />
            </div>
          ))}
        </div>
      )}
      {children}
    </Modal>
  );
};
