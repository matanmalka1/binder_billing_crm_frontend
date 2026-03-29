import { Controller } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { DatePicker } from "../../../components/ui/DatePicker";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
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

type SharedTaxDeadlineForm = UseFormReturn<CreateTaxDeadlineForm> | UseFormReturn<EditTaxDeadlineForm>;

interface TaxDeadlineCommonFieldsProps {
  form: SharedTaxDeadlineForm;
}

export const TaxDeadlineCommonFields: React.FC<TaxDeadlineCommonFieldsProps> = ({
  form,
}) => {
  const register = form.register as UseFormRegister<TaxDeadlineFormValues>;
  const control = form.control as Control<TaxDeadlineFormValues>;
  const errors = form.formState.errors as FieldErrors<TaxDeadlineFormValues>;

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
          />
        )}
      />

      <Input
        label="סכום לתשלום"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
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
