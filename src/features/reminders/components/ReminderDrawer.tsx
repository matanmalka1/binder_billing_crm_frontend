import {
  DetailDrawer,
  DrawerField,
  DrawerSection,
} from "../../../components/ui/overlays/DetailDrawer";
import { Badge } from "../../../components/ui/primitives/Badge";
import type { Reminder } from "../api";
import { reminderTypeLabels, statusLabels, reminderStatusVariants } from "../types";
import { formatClientOfficeId, formatDate, formatDateTime } from "../../../utils/utils";

interface ReminderDrawerProps {
  reminder: Reminder | null;
  onClose: () => void;
}

export const ReminderDrawer: React.FC<ReminderDrawerProps> = ({
  reminder,
  onClose,
}) => (
  <DetailDrawer
    open={reminder !== null}
    title={
      reminder
        ? (reminder.display_label ?? reminderTypeLabels[reminder.reminder_type] ?? reminder.reminder_type)
        : ""
    }
    onClose={onClose}
  >
    {reminder && (
      <>
        <DrawerSection title="פרטי תזכורת">
          <DrawerField label="לקוח" value={reminder.client_name} />
          <DrawerField
            label="מס' לקוח "
            value={reminder.office_client_number != null ? formatClientOfficeId(reminder.office_client_number) : "—"}
          />
          <DrawerField label="ת.ז / ח.פ" value={reminder.client_id_number ?? "—"} />
          <DrawerField
            label="סוג"
            value={
              reminder.display_label ??
              reminderTypeLabels[reminder.reminder_type] ??
              reminder.reminder_type
            }
          />
          <DrawerField
            label="סטטוס"
            value={
              <Badge variant={reminderStatusVariants[reminder.status as keyof typeof reminderStatusVariants] ?? "neutral"}>
                {statusLabels[reminder.status]}
              </Badge>
            }
          />
          <DrawerField label="הודעה" value={reminder.message} />
        </DrawerSection>

        <DrawerSection title="תזמון">
          <DrawerField
            label="תאריך יעד"
            value={formatDate(reminder.target_date)}
          />
          <DrawerField label="שליחה ב" value={formatDate(reminder.send_on)} />
          <DrawerField
            label="ימים לפני"
            value={`${reminder.days_before} ימים`}
          />
          <DrawerField
            label="נוצר"
            value={formatDateTime(reminder.created_at)}
          />
          {reminder.sent_at && (
            <DrawerField
              label="נשלח ב"
              value={formatDateTime(reminder.sent_at)}
            />
          )}
          {reminder.canceled_at && (
            <DrawerField
              label="בוטל ב"
              value={formatDateTime(reminder.canceled_at)}
            />
          )}
        </DrawerSection>

        {(reminder.binder_id ??
          reminder.charge_id ??
          reminder.tax_deadline_id ??
          reminder.annual_report_id ??
          reminder.advance_payment_id) && (
          <DrawerSection title="קישור לרשומה">
            {reminder.binder_id && (
              <DrawerField label="קלסר" value={`#${reminder.binder_id}`} />
            )}
            {reminder.charge_id && (
              <DrawerField label="חשבונית" value={`#${reminder.charge_id}`} />
            )}
            {reminder.tax_deadline_id && (
              <DrawerField
                label="מועד מס"
                value={`#${reminder.tax_deadline_id}`}
              />
            )}
            {reminder.annual_report_id && (
              <DrawerField label='דוח שנתי' value={`#${reminder.annual_report_id}`} />
            )}
            {reminder.advance_payment_id && (
              <DrawerField label="מקדמה" value={`#${reminder.advance_payment_id}`} />
            )}
          </DrawerSection>
        )}
      </>
    )}
  </DetailDrawer>
);
ReminderDrawer.displayName = "ReminderDrawer";
