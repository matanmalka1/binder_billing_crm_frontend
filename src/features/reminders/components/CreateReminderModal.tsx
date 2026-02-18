import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { UseFormReturn } from "react-hook-form";
import type { CreateReminderFormValues } from "../reminder.types";

interface CreateReminderModalProps {
  open: boolean;
  form: UseFormReturn<CreateReminderFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  form,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const reminderType = watch("reminder_type");

  return (
    <Modal
      open={open}
      title="תזכורת חדשה"
      onClose={onClose}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
          >
            יצירה
          </Button>
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
            error={errors.tax_deadline_id?.message}
            min={1}
            {...register("tax_deadline_id", { required: "נא להזין מזהה מועד מס" })}
          />
        )}

        {reminderType === "binder_idle" && (
          <Input
            type="number"
            label="מזהה תיק"
            error={errors.binder_id?.message}
            min={1}
            {...register("binder_id", { required: "נא להזין מזהה תיק" })}
          />
        )}

        {reminderType === "unpaid_charge" && (
          <Input
            type="number"
            label="מזהה חשבונית"
            error={errors.charge_id?.message}
            min={1}
            {...register("charge_id", { required: "נא להזין מזהה חשבונית" })}
          />
        )}

        <Input
          type="number"
          label="מזהה לקוח"
          error={errors.client_id?.message}
          min={1}
          {...register("client_id", {
            required: "נא להזין מזהה לקוח",
            min: { value: 1, message: "נא להזין מזהה לקוח תקין" },
          })}
        />

        <Input
          type="date"
          label="תאריך יעד"
          error={errors.target_date?.message}
          {...register("target_date", { required: "נא לבחור תאריך יעד" })}
        />

        <Input
          type="number"
          label="ימים לפני"
          error={errors.days_before?.message}
          min={0}
          {...register("days_before", {
            required: "נא להזין מספר ימים",
            min: { value: 0, message: "מספר ימים לפני חייב להיות חיובי" },
            valueAsNumber: true,
          })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            הודעה{" "}
            {reminderType === "custom" && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              reminderType === "custom"
                ? "הזן הודעת תזכורת..."
                : "אופציונלי (אם ריק תופק הודעת ברירת מחדל)"
            }
            {...register("message", {
              required: reminderType === "custom" ? "נא להזין הודעת תזכורת" : false,
            })}
          />
          {errors.message?.message && (
            <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
