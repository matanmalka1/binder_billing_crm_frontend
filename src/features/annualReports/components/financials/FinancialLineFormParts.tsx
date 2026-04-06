import type { FormEvent, ReactNode } from "react";
import { Plus } from "lucide-react";
import { Select } from "../../../../components/ui/inputs/Select";
import { Button } from "../../../../components/ui/primitives/Button";

export const FINANCIAL_FIELD_CLASS =
  "w-full rounded border border-gray-200 px-2 py-1 text-sm";
export const INLINE_ADD_FORM_CLASS = "mt-2 flex flex-col gap-2";
export const INLINE_EDIT_FORM_CLASS =
  "mt-2 mb-2 space-y-2 rounded-md border border-blue-100 bg-blue-50/30 p-2";

interface AddLineTriggerButtonProps {
  label: string;
  onClick: () => void;
}

export const AddLineTriggerButton: React.FC<AddLineTriggerButtonProps> = ({
  label,
  onClick,
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="mt-1 gap-1 text-xs"
  >
    <Plus className="h-3.5 w-3.5" />
    {label}
  </Button>
);

interface FinancialSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  placeholder?: string;
}

export const FinancialSelectField: React.FC<FinancialSelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => (
  <Select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    options={[
      ...(placeholder
        ? [{ value: "", label: placeholder, disabled: true }]
        : []),
      ...Object.entries(options).map(([key, label]) => ({ value: key, label })),
    ]}
    className={`${FINANCIAL_FIELD_CLASS} bg-white`}
  />
);

interface FinancialInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "number" | "text";
  min?: string;
  max?: string;
  step?: string;
}

export const FinancialInputField: React.FC<FinancialInputFieldProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  step,
}) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    type={type}
    min={min}
    max={max}
    step={step}
    placeholder={placeholder}
    className={FINANCIAL_FIELD_CLASS}
  />
);

interface FinancialAmountDescriptionFieldsProps {
  amount: string;
  onAmountChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const FinancialAmountDescriptionFields: React.FC<
  FinancialAmountDescriptionFieldsProps
> = ({ amount, onAmountChange, description, onDescriptionChange }) => (
  <>
    <FinancialInputField
      value={amount}
      onChange={onAmountChange}
      type="number"
      min="0"
      step="0.01"
      placeholder="סכום ₪"
    />
    <FinancialInputField
      value={description}
      onChange={onDescriptionChange}
      placeholder="תיאור (אופציונלי)"
    />
  </>
);

interface ExpenseSupplementaryFieldsProps {
  recognitionRate: string;
  onRecognitionRateChange: (value: string) => void;
  documentReference: string;
  onDocumentReferenceChange: (value: string) => void;
}

export const ExpenseSupplementaryFields: React.FC<
  ExpenseSupplementaryFieldsProps
> = ({
  recognitionRate,
  onRecognitionRateChange,
  documentReference,
  onDocumentReferenceChange,
}) => (
  <>
    <FinancialInputField
      value={recognitionRate}
      onChange={onRecognitionRateChange}
      type="number"
      min="0"
      max="100"
      step="1"
      placeholder="שיעור הכרה (%)"
    />
    <FinancialInputField
      value={documentReference}
      onChange={onDocumentReferenceChange}
      placeholder="אסמכתא (אופציונלי)"
    />
  </>
);

interface FinancialFormActionsProps {
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export const FinancialFormActions: React.FC<FinancialFormActionsProps> = ({
  isSubmitting,
  submitLabel,
  onCancel,
}) => (
  <div className="flex gap-2">
    <Button type="submit" size="sm" isLoading={isSubmitting} className="flex-1">
      {submitLabel}
    </Button>
    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
      ביטול
    </Button>
  </div>
);

interface FinancialFormErrorProps {
  error: string | null;
}

export const FinancialFormError: React.FC<FinancialFormErrorProps> = ({
  error,
}) => (error ? <p className="text-xs text-red-500">{error}</p> : null);

interface FinancialFormLayoutProps {
  className: string;
  children: ReactNode;
}

export const FinancialFormLayout: React.FC<FinancialFormLayoutProps> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;

interface FinancialAddFormShellProps {
  open: boolean;
  label: string;
  error: string | null;
  isSubmitting: boolean;
  onOpen: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  children: ReactNode;
}

export const FinancialAddFormShell: React.FC<FinancialAddFormShellProps> = ({
  open,
  label,
  error,
  isSubmitting,
  onOpen,
  onSubmit,
  onCancel,
  children,
}) => {
  if (!open) {
    return <AddLineTriggerButton label={label} onClick={onOpen} />;
  }

  return (
    <form onSubmit={onSubmit}>
      <FinancialFormLayout className={INLINE_ADD_FORM_CLASS}>
        {children}
        <FinancialFormError error={error} />
        <FinancialFormActions
          isSubmitting={isSubmitting}
          submitLabel="הוסף"
          onCancel={onCancel}
        />
      </FinancialFormLayout>
    </form>
  );
};

interface FinancialEditFormShellProps {
  error: string | null;
  isSubmitting: boolean;
  submitLabel?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  children: ReactNode;
}

export const FinancialEditFormShell: React.FC<FinancialEditFormShellProps> = ({
  error,
  isSubmitting,
  submitLabel = "שמור",
  onSubmit,
  onCancel,
  children,
}) => (
  <form onSubmit={onSubmit}>
    <FinancialFormLayout className={INLINE_EDIT_FORM_CLASS}>
      {children}
      <FinancialFormError error={error} />
      <FinancialFormActions
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        onCancel={onCancel}
      />
    </FinancialFormLayout>
  </form>
);
