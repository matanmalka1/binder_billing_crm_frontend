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
import {
  REQUIRED_FIELD_MESSAGE,
  TAX_DEADLINE_TYPE_OPTIONS,
} from "../constants";
import type {
  CreateTaxDeadlineForm,
  EditTaxDeadlineForm,
  TaxDeadlineFormValues,
} from "../types";
import { getCurrentTaxYear } from "../utils";
import type { VatType } from "@/features/clients";

type SharedTaxDeadlineForm = UseFormReturn<CreateTaxDeadlineForm> | UseFormReturn<EditTaxDeadlineForm>;

const currencySuffix = <span className="text-sm text-gray-400">₪</span>;

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
  const shouldValidateDerivedFields = typedForm.formState.submitCount > 0;
  const deadlineType = typedForm.watch("deadline_type");
  const period = typedForm.watch("period");

  const periodMaterialType = deadlineType === "vat"
    ? "vat"
    : deadlineType === "annual_report"
      ? "annual_report"
      : "national_insurance";
  const isAutoVatDueDate = deadlineType === "vat";

  useEffect(() => {
    if (deadlineType !== "annual_report" || period) return;
    typedForm.setValue("period", String(getCurrentTaxYear()), {
      shouldDirty: false,
      shouldValidate: shouldValidateDerivedFields,
    });
  }, [deadlineType, period, shouldValidateDerivedFields, typedForm]);

  return (
    <>
      <Select
        label="סוג מועד *"
        {...register("deadline_type", { required: REQUIRED_FIELD_MESSAGE })}
        error={errors.deadline_type?.message}
        options={TAX_DEADLINE_TYPE_OPTIONS}
      />

      <Controller
        name="due_date"
        control={control}
        rules={{ required: isAutoVatDueDate ? false : REQUIRED_FIELD_MESSAGE }}
        render={({ field }) => (
          <DatePicker
            label={isAutoVatDueDate ? "תאריך מועד (יחושב אוטומטית)" : "תאריך מועד *"}
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
      <input type="hidden" {...register("period", { required: REQUIRED_FIELD_MESSAGE })} />

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
  submitForm?: string;
  submitType?: "button" | "submit";
}

export const TaxDeadlineModalFooter: React.FC<TaxDeadlineModalFooterProps> = ({
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
  submitForm,
  submitType = "button",
}) => (
  <div className="flex items-center justify-end gap-2">
    <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
      ביטול
    </Button>
    <Button
      type={submitType}
      form={submitForm}
      onClick={submitType === "button" ? onSubmit : undefined}
      isLoading={isSubmitting}
    >
      {submitLabel}
    </Button>
  </div>
);
