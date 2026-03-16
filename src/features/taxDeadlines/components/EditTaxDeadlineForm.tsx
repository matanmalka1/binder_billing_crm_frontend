import { Controller } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Modal } from "../../../components/ui/Modal";
import { DatePicker } from "../../../components/ui/DatePicker";
import type { UseFormReturn } from "react-hook-form";
import type { EditTaxDeadlineForm } from "../types";

interface EditTaxDeadlineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<EditTaxDeadlineForm>;
  isSubmitting: boolean;
}

const DEADLINE_TYPE_OPTIONS = [
  { value: "vat", label: "מע״מ" },
  { value: "advance_payment", label: "מקדמות" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "other", label: "אחר" },
];

export const EditTaxDeadlineFormModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: EditTaxDeadlineFormProps) => {
  const { register, control, formState: { errors }, reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="עריכת מועד מס"
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" onClick={onSubmit} isLoading={isSubmitting}>
            עדכן מועד
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Select
          label="סוג מועד *"
          {...register("deadline_type", { required: "שדה חובה" })}
          error={errors.deadline_type?.message}
          options={DEADLINE_TYPE_OPTIONS}
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
      </div>
    </Modal>
  );
};

EditTaxDeadlineFormModal.displayName = "EditTaxDeadlineFormModal";
