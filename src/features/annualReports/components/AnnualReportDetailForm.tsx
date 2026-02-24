import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import type { AnnualReportDetail } from "../hooks/useAnnualReportDetail";
import {
  annualReportDetailSchema,
  annualReportDetailDefaults,
  type AnnualReportDetailFormValues,
} from "../schemas";

interface AnnualReportDetailFormProps {
  detail: AnnualReportDetail | null;
  onSave: (data: Partial<AnnualReportDetail>) => void;
  isSaving: boolean;
}

export const AnnualReportDetailForm: React.FC<AnnualReportDetailFormProps> = ({
  detail,
  onSave,
  isSaving,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnualReportDetailFormValues>({
    resolver: zodResolver(annualReportDetailSchema),
    defaultValues: {
      ...annualReportDetailDefaults,
      tax_refund_amount:
        detail?.tax_refund_amount != null ? String(detail.tax_refund_amount) : "",
      tax_due_amount:
        detail?.tax_due_amount != null ? String(detail.tax_due_amount) : "",
      client_approved_at: detail?.client_approved_at?.split("T")[0] ?? "",
      internal_notes: detail?.internal_notes ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    onSave({
      tax_refund_amount: values.tax_refund_amount ? Number(values.tax_refund_amount) : null,
      tax_due_amount: values.tax_due_amount ? Number(values.tax_due_amount) : null,
      client_approved_at: values.client_approved_at || null,
      internal_notes: values.internal_notes || null,
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="סכום החזר מס (₪)"
          type="number"
          step="0.01"
          error={errors.tax_refund_amount?.message}
          {...register("tax_refund_amount")}
        />
        <Input
          label="סכום לתשלום (₪)"
          type="number"
          step="0.01"
          error={errors.tax_due_amount?.message}
          {...register("tax_due_amount")}
        />
        <Input
          label="תאריך אישור לקוח"
          type="date"
          error={errors.client_approved_at?.message}
          {...register("client_approved_at")}
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