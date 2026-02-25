import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Modal } from "../../../components/ui/Modal";
import type { UseFormReturn } from "react-hook-form";
import type { CreateTaxDeadlineForm } from "../types";

interface TaxDeadlineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<CreateTaxDeadlineForm>;
  isSubmitting: boolean;
}

const DEADLINE_TYPE_OPTIONS = [
  { value: "vat", label: "מע״מ" },
  { value: "advance_payment", label: "מקדמות" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "other", label: "אחר" },
];

export const TaxDeadlineForm = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: TaxDeadlineFormProps) => {
  const { register, formState: { errors }, reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="יצירת מועד מס חדש"
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" onClick={onSubmit} isLoading={isSubmitting}>
            צור מועד
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="מזהה לקוח *"
          type="number"
          placeholder="לדוגמה: 123"
          {...register("client_id", { required: "שדה חובה" })}
          error={errors.client_id?.message}
        />

        <Select
          label="סוג מועד *"
          {...register("deadline_type", { required: "שדה חובה" })}
          error={errors.deadline_type?.message}
          options={DEADLINE_TYPE_OPTIONS}
        />

        <Input
          label="תאריך מועד *"
          type="date"
          {...register("due_date", { required: "שדה חובה" })}
          error={errors.due_date?.message}
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
      </div>
    </Modal>
  );
};

TaxDeadlineForm.displayName = "TaxDeadlineForm";