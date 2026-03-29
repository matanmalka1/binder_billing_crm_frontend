import type { ReactNode } from "react";
import { Button } from "./Button";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ModalFormActionsProps {
  cancelDisabled?: boolean;
  cancelLabel?: ReactNode;
  cancelVariant?: ButtonVariant;
  onCancel: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitForm?: string;
  submitLabel: ReactNode;
  submitLoading?: boolean;
  submitType?: "button" | "submit";
  submitVariant?: ButtonVariant;
}

export const ModalFormActions: React.FC<ModalFormActionsProps> = ({
  cancelDisabled = false,
  cancelLabel = "ביטול",
  cancelVariant = "outline",
  onCancel,
  onSubmit,
  submitDisabled = false,
  submitForm,
  submitLabel,
  submitLoading = false,
  submitType = "button",
  submitVariant = "primary",
}) => {
  const submitProps =
    submitType === "submit" ? { form: submitForm } : { onClick: onSubmit };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant={cancelVariant} onClick={onCancel} disabled={cancelDisabled}>
        {cancelLabel}
      </Button>
      <Button
        type={submitType}
        variant={submitVariant}
        isLoading={submitLoading}
        disabled={submitDisabled}
        {...submitProps}
      >
        {submitLabel}
      </Button>
    </div>
  );
};
