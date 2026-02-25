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

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  form,
  isSubmitting,
  onClose,
  onSubmit,
  fixedClientId,
}) => {
  const { register, watch, formState: { errors } } = form;
  const reminderType = watch("reminder_type");
  const isCustom = reminderType === "custom";

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
          error={errors.reminder_type?.message}
          {...register("reminder_type", { required: "נא לבחור סוג תזכורת" })}
        >
          <option value="tax_deadline_approaching">מועד מס מתקרב</option>
          <option value="binder_idle">תיק לא פעיל</option>
          <option value="unpaid_charge">חשבונית שלא שולמה</option>
          <option value="custom">התאמה אישית</option>
        </Select>

        {reminderType === "tax_deadline_approaching" && (
          <Input
            type="number"
            label="מזהה מועד מס"
            min={1}
            error={errors.tax_deadline_id?.message}
            {...register("tax_deadline_id", { required: "נא להזין מזהה מועד מס" })}
          />
        )}
        {reminderType === "binder_idle" && (
          <Input
            type="number"
            label="מזהה תיק"
            min={1}
            error={errors.binder_id?.message}
            {...register("binder_id", { required: "נא להזין מזהה תיק" })}
          />
        )}
        {reminderType === "unpaid_charge" && (
          <Input
            type="number"
            label="מזהה חשבונית"
            min={1}
            error={errors.charge_id?.message}
            {...register("charge_id", { required: "נא להזין מזהה חשבונית" })}
          />
        )}

        {fixedClientId ? (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">לקוח</p>
            <p className="text-sm font-mono text-gray-900">#{fixedClientId}</p>
            <input type="hidden" value={fixedClientId} {...register("client_id")} />
          </div>
        ) : (
          <Input
            type="number"
            label="מזהה לקוח"
            min={1}
            error={errors.client_id?.message}
            {...register("client_id", {
              required: "נא להזין מזהה לקוח",
              min: { value: 1, message: "נא להזין מזהה לקוח תקין" },
            })}
          />
        )}

        <Input
          type="date"
          label="תאריך יעד"
          error={errors.target_date?.message}
          {...register("target_date", { required: "נא לבחור תאריך יעד" })}
        />

        <Input
          type="number"
          label="ימים לפני"
          min={0}
          error={errors.days_before?.message}
          {...register("days_before", {
            required: "נא להזין מספר ימים",
            min: { value: 0, message: "מספר ימים לפני חייב להיות חיובי" },
            valueAsNumber: true,
          })}
        />

        <Textarea
          label={isCustom ? "הודעה *" : "הודעה"}
          rows={3}
          placeholder={isCustom ? "הזן הודעת תזכורת..." : "אופציונלי — אם ריק תופק הודעת ברירת מחדל"}
          error={errors.message?.message}
          {...register("message", {
            required: isCustom ? "נא להזין הודעת תזכורת" : false,
          })}
        />
      </form>
    </Modal>
  );
};