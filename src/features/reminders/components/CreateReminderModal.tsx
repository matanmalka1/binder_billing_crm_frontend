import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { Reminder, CreateReminderRequest } from "../reminder.types";

interface CreateReminderModalProps {
  open: boolean;
  formData: CreateReminderRequest;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: Partial<CreateReminderRequest>) => void;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  formData,
  isSubmitting,
  onClose,
  onSubmit,
  onFormChange,
}) => {
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
          value={formData.reminder_type}
          onChange={(e) =>
            onFormChange({
              reminder_type: e.target.value as Reminder["reminder_type"],
            })
          }
        >
          <option value="TAX_DEADLINE_APPROACHING">מועד מס מתקרב</option>
          <option value="BINDER_IDLE">תיק לא פעיל</option>
          <option value="UNPAID_CHARGE">חשבונית שלא שולמה</option>
          <option value="CUSTOM">התאמה אישית</option>
        </Select>

        <Input
          type="number"
          label="מזהה לקוח"
          value={formData.client_id || ""}
          onChange={(e) =>
            onFormChange({ client_id: parseInt(e.target.value) || 0 })
          }
          required
          min={1}
        />

        <Input
          type="date"
          label="תאריך יעד"
          value={formData.target_date}
          onChange={(e) => onFormChange({ target_date: e.target.value })}
          required
        />

        <Input
          type="number"
          label="ימים לפני"
          value={formData.days_before}
          onChange={(e) =>
            onFormChange({ days_before: parseInt(e.target.value) || 0 })
          }
          required
          min={0}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            הודעה <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="הזן הודעת תזכורת..."
            value={formData.message}
            onChange={(e) => onFormChange({ message: e.target.value })}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
