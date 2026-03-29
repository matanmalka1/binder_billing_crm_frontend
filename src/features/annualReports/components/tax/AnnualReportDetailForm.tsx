import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../../components/ui/primitives/Button";
import { Input } from "../../../../components/ui/inputs/Input";
import { DatePicker } from "../../../../components/ui/inputs/DatePicker";
import { Textarea } from "../../../../components/ui/inputs/Textarea";
import type { AnnualReportDetail } from "../../types";
import {
  annualReportDetailSchema,
  annualReportDetailDefaults,
  type AnnualReportDetailFormValues,
} from "../../schemas";

interface AnnualReportDetailFormProps {
  detail: AnnualReportDetail | null;
  onSave: (data: Partial<AnnualReportDetail>) => void;
  isSaving: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  submitRef?: React.RefObject<(() => void) | null>;
}

const toFormValues = (detail: AnnualReportDetail | null): AnnualReportDetailFormValues => ({
  ...annualReportDetailDefaults,
  tax_refund_amount: detail?.tax_refund_amount != null ? String(detail.tax_refund_amount) : "",
  tax_due_amount: detail?.tax_due_amount != null ? String(detail.tax_due_amount) : "",
  client_approved_at: detail?.client_approved_at?.split("T")[0] ?? "",
  internal_notes: detail?.internal_notes ?? "",
});

export const AnnualReportDetailForm: React.FC<AnnualReportDetailFormProps> = ({
  detail,
  onSave,
  isSaving,
  onDirtyChange,
  submitRef,
}) => {
  const onDirtyChangeRef = useRef(onDirtyChange);
  onDirtyChangeRef.current = onDirtyChange;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AnnualReportDetailFormValues>({
    resolver: zodResolver(annualReportDetailSchema),
    defaultValues: toFormValues(detail),
  });

  useEffect(() => {
    reset(toFormValues(detail));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.id, detail?.tax_refund_amount, detail?.tax_due_amount, detail?.client_approved_at, detail?.internal_notes]);

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty);
  }, [isDirty]);

  const onSubmit = handleSubmit((values) => {
    onSave({
      tax_refund_amount: values.tax_refund_amount ? Number(values.tax_refund_amount) : null,
      tax_due_amount: values.tax_due_amount ? Number(values.tax_due_amount) : null,
      client_approved_at: values.client_approved_at || null,
      internal_notes: values.internal_notes || null,
    });
  });

  useEffect(() => {
    if (submitRef) {
      submitRef.current = onSubmit;
    }
  }, [submitRef, onSubmit]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="סכום החזר מס (₪)"
          type="text"
          inputMode="decimal"
          error={errors.tax_refund_amount?.message}
          {...register("tax_refund_amount")}
        />
        <Input
          label="סכום לתשלום (₪)"
          type="text"
          inputMode="decimal"
          error={errors.tax_due_amount?.message}
          {...register("tax_due_amount")}
        />
        <Controller
          control={control}
          name="client_approved_at"
          render={({ field }) => (
            <DatePicker
              label="תאריך אישור לקוח"
              error={errors.client_approved_at?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <Textarea
        label="הערות פנימיות"
        rows={3}
        error={errors.internal_notes?.message}
        {...register("internal_notes")}
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving}>
          שמור פרטים
        </Button>
      </div>
    </form>
  );
};

AnnualReportDetailForm.displayName = "AnnualReportDetailForm";
