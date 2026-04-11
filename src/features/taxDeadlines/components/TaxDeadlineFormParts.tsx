import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Button } from "../../../components/ui/primitives/Button";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { Input } from "../../../components/ui/inputs/Input";
import { ReportingPeriodField } from "../../../components/ui/inputs/ReportingPeriodField";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { TAX_DEADLINE_TYPE_OPTIONS } from "../constants";
import type {
  CreateTaxDeadlineForm,
  EditTaxDeadlineForm,
  TaxDeadlineFormValues,
} from "../types";
import type { VatType } from "@/features/clients";

type SharedTaxDeadlineForm = UseFormReturn<CreateTaxDeadlineForm> | UseFormReturn<EditTaxDeadlineForm>;

const currencySuffix = <span className="text-sm text-gray-400">₪</span>;

const VAT_FILING_DUE_DAY = 19;

const computeVatDueDate = (period: string, vatType: VatType | null) => {
  if (!period || vatType === "exempt") return "";

  const [yearPart, monthPart] = period.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return "";

  const filingMonthOffset = vatType === "bimonthly" ? 2 : 1;
  const dueMonthIndex = month - 1 + filingMonthOffset;
  const dueYear = year + Math.floor(dueMonthIndex / 12);
  const dueMonth = (dueMonthIndex % 12) + 1;

  return `${dueYear}-${String(dueMonth).padStart(2, "0")}-${String(VAT_FILING_DUE_DAY).padStart(2, "0")}`;
};

interface TaxDeadlineCommonFieldsProps {
  form: SharedTaxDeadlineForm;
  vatType?: VatType | null;
}

export const TaxDeadlineCommonFields: React.FC<TaxDeadlineCommonFieldsProps> = ({
  form,
  vatType = null,
}) => {
  const typedForm = form as unknown as UseFormReturn<TaxDeadlineFormValues>;
  const register = typedForm.register as UseFormRegister<TaxDeadlineFormValues>;
  const control = typedForm.control as Control<TaxDeadlineFormValues>;
  const errors = typedForm.formState.errors as FieldErrors<TaxDeadlineFormValues>;
  const deadlineType = typedForm.watch("deadline_type");
  const period = typedForm.watch("period");

  const periodMaterialType = deadlineType === "vat"
    ? "vat"
    : deadlineType === "annual_report"
      ? "annual_report"
      : "other";
  const isAutoVatDueDate = deadlineType === "vat";

  useEffect(() => {
    if (deadlineType !== "vat") return;
    const dueDate = computeVatDueDate(period, vatType);
    typedForm.setValue("due_date", dueDate, { shouldDirty: true, shouldValidate: true });
  }, [deadlineType, period, typedForm, vatType]);

  return (
    <>
      <Select
        label="סוג מועד *"
        {...register("deadline_type", { required: "שדה חובה" })}
        error={errors.deadline_type?.message}
        options={TAX_DEADLINE_TYPE_OPTIONS}
      />

      <Controller
        name="due_date"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="תאריך מועד *"
            error={errors.due_date?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isAutoVatDueDate}
          />
        )}
      />

      <ReportingPeriodField
        materialType={periodMaterialType}
        vatType={vatType}
        value={typedForm.watch("period")}
        onChange={(value) => typedForm.setValue("period", value, { shouldDirty: true, shouldValidate: true })}
        error={errors.period?.message}
      />

      <Input
        label="סכום לתשלום"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        endElement={currencySuffix}
        {...register("payment_amount")}
        error={errors.payment_amount?.message}
      />

      <Textarea
        label="הערות"
        rows={3}
        placeholder="הערות נוספות על המועד..."
        {...register("description")}
      />
    </>
  );
};

interface TaxDeadlineModalFooterProps {
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export const TaxDeadlineModalFooter: React.FC<TaxDeadlineModalFooterProps> = ({
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}) => (
  <div className="flex items-center justify-end gap-2">
    <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
      ביטול
    </Button>
    <Button type="button" onClick={onSubmit} isLoading={isSubmitting}>
      {submitLabel}
    </Button>
  </div>
);
