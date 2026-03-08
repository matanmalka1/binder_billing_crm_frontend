import type { UseFormReturn } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { CreateReminderFormValues } from "../reminder.types";
import type { BinderResponse } from "../../../api/binders.types";
import type { ChargeResponse } from "../../../api/charges.api";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";

interface CreateReminderModalProps {
  open: boolean;
  form: UseFormReturn<CreateReminderFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  fixedClientId?: number;
  fixedClientName?: string;
  clientBinders?: BinderResponse[];
  clientCharges?: ChargeResponse[];
  clientTaxDeadlines?: TaxDeadlineResponse[];
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
  fixedClientName,
  clientBinders = [],
  clientCharges = [],
  clientTaxDeadlines = [],
}) => {
  const { register, watch, formState: { errors } } = form;
  const e = errors as FormErrors;
  const reminderType = watch("reminder_type");

  const clientDisplay = fixedClientId
    ? fixedClientName
      ? `${fixedClientName} (#${fixedClientId})`
      : `#${fixedClientId}`
    : null;

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
          <Select label="מועד מס" error={e.tax_deadline_id?.message} {...register("tax_deadline_id")}>
            <option value="">בחר מועד מס...</option>
            {clientTaxDeadlines.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.deadline_type} — {d.due_date}
              </option>
            ))}
          </Select>
        )}
        {reminderType === "binder_idle" && (
          <Select label="תיק" error={e.binder_id?.message} {...register("binder_id")}>
            <option value="">בחר תיק...</option>
            {clientBinders.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.binder_number} — {b.binder_type}
              </option>
            ))}
          </Select>
        )}
        {reminderType === "unpaid_charge" && (
          <Select label="חשבונית" error={e.charge_id?.message} {...register("charge_id")}>
            <option value="">בחר חשבונית...</option>
            {clientCharges.map((c) => (
              <option key={c.id} value={String(c.id)}>
                #{c.id} — {c.charge_type} ({c.status})
              </option>
            ))}
          </Select>
        )}

        {reminderType === "custom" && (
          <Input
            label="שם תזכורת מותאמת *"
            placeholder="לדוג': תזכורת לחידוש רישיון"
            error={e.message?.message}
            {...register("message")}
          />
        )}

        {clientDisplay ? (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">לקוח</p>
            <p className="text-sm text-gray-900">{clientDisplay}</p>
            <input type="hidden" value={String(fixedClientId)} {...register("client_id")} />
          </div>
        ) : (
          <Input type="number" label="מזהה לקוח" min={1}
            error={e.client_id?.message} {...register("client_id")} />
        )}

        <Input type="date" label="תאריך יעד" max="9999-12-31"
          error={e.target_date?.message} {...register("target_date")} />

        <Input type="number" label="ימים לפני" min={0}
          error={e.days_before?.message}
          {...register("days_before", { valueAsNumber: true })} />

        {(reminderType === "tax_deadline_approaching" ||
          reminderType === "binder_idle" ||
          reminderType === "unpaid_charge") && (
          <Textarea
            label="הודעה"
            rows={3}
            placeholder="אופציונלי — אם ריק תופק הודעת ברירת מחדל"
            error={e.message?.message}
            {...register("message")}
          />
        )}
      </form>
    </Modal>
  );
};

CreateReminderModal.displayName = "CreateReminderModal";