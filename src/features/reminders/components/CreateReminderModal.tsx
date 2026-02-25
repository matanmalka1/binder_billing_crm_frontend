import type { UseFormReturn } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { CreateReminderFormValues } from "../reminder.types";

interface CreateReminderModalProps {
  open: boolean;
  form: UseFormReturn<CreateReminderFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  fixedClientId?: number;
}

// react-hook-form types errors on discriminated unions narrowly; cast once here.
type FormErrors = Partial<Record<keyof CreateReminderFormValues, { message?: string }>>;

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  form,
  isSubmitting,
  onClose,
  onSubmit,
  fixedClientId,
}) => {
  const { register, watch, formState: { errors } } = form;
  const e = errors as FormErrors;
  const reminderType = watch("reminder_type");

  return (
    <Modal
      open={open}
      title="תזכורת חדשה"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>ביטול</Button>
          <Button type="button" variant="primary" onClick={onSubmit} isLoading={isSubmitting}>יצירה</Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="סוג תזכורת"
          error={e.reminder_type?.message}
          {...register("reminder_type")}
        >
          <option value="tax_deadline_approaching">מועד מס מתקרב</option>
          <option value="binder_idle">תיק לא פעיל</option>
          <option value="unpaid_charge">חשבונית שלא שולמה</option>
          <option value="custom">התאמה אישית</option>
        </Select>

        {reminderType === "tax_deadline_approaching" && (
          <Input type="number" label="מזהה מועד מס" min={1}
            error={e.tax_deadline_id?.message} {...register("tax_deadline_id")} />
        )}
        {reminderType === "binder_idle" && (
          <Input type="number" label="מזהה תיק" min={1}
            error={e.binder_id?.message} {...register("binder_id")} />
        )}
        {reminderType === "unpaid_charge" && (
          <Input type="number" label="מזהה חשבונית" min={1}
            error={e.charge_id?.message} {...register("charge_id")} />
        )}

        {fixedClientId ? (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">לקוח</p>
            <p className="text-sm font-mono text-gray-900">#{fixedClientId}</p>
            <input type="hidden" value={String(fixedClientId)} {...register("client_id")} />
          </div>
        ) : (
          <Input type="number" label="מזהה לקוח" min={1}
            error={e.client_id?.message} {...register("client_id")} />
        )}

        <Input type="date" label="תאריך יעד"
          error={e.target_date?.message} {...register("target_date")} />

        <Input type="number" label="ימים לפני" min={0}
          error={e.days_before?.message}
          {...register("days_before", { valueAsNumber: true })} />

        <Textarea
          label={reminderType === "custom" ? "הודעה *" : "הודעה"}
          rows={3}
          placeholder={reminderType === "custom"
            ? "הזן הודעת תזכורת..."
            : "אופציונלי — אם ריק תופק הודעת ברירת מחדל"}
          error={e.message?.message}
          {...register("message")}
        />
      </form>
    </Modal>
  );
};