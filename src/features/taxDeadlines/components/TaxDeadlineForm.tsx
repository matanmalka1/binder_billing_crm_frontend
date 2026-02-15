import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Modal } from "../../../components/ui/Modal";
import type { UseFormReturn } from "react-hook-form";
import type { CreateTaxDeadlineForm } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<CreateTaxDeadlineForm>;
  isSubmitting: boolean;
}

export const TaxDeadlineForm: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}) => {
  return (
    <Modal
      open={open}
      title="מועד חדש"
      onClose={() => {
        onClose();
        form.reset();
      }}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              form.reset();
            }}
          >
            ביטול
          </Button>
          <Button type="submit" onClick={onSubmit} isLoading={isSubmitting}>
            צור מועד
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="מזהה לקוח *"
          type="number"
          {...form.register("client_id", { required: "שדה חובה" })}
          error={form.formState.errors.client_id?.message}
        />
        <Select
          label="סוג מועד *"
          {...form.register("deadline_type", { required: "שדה חובה" })}
          error={form.formState.errors.deadline_type?.message}
        >
          <option value="vat">מע״מ</option>
          <option value="advance_payment">מקדמות</option>
          <option value="national_insurance">ביטוח לאומי</option>
          <option value="annual_report">דוח שנתי</option>
          <option value="other">אחר</option>
        </Select>
        <Input
          label="תאריך מועד *"
          type="date"
          {...form.register("due_date", { required: "שדה חובה" })}
          error={form.formState.errors.due_date?.message}
        />
        <Input
          label="סכום לתשלום"
          type="number"
          step="0.01"
          {...form.register("payment_amount")}
          error={form.formState.errors.payment_amount?.message}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            הערות
          </label>
          <textarea
            {...form.register("description")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="הערות נוספות..."
          />
        </div>
      </form>
    </Modal>
  );
};
