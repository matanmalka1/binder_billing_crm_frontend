import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import type { Reminder } from "../../../api/reminders.api";
import { reminderTypeLabels, statusLabels } from "../reminder.types";
import { formatDate, formatDateTime } from "../../../utils/utils";

interface ReminderDrawerProps {
  reminder: Reminder | null;
  onClose: () => void;
}

const statusVariants: Record<string, "success" | "error" | "warning"> = {
  sent: "success",
  canceled: "error",
  pending: "warning",
};

export const ReminderDrawer: React.FC<ReminderDrawerProps> = ({ reminder, onClose }) => (
  <DetailDrawer
    open={reminder !== null}
    title={reminder ? (reminderTypeLabels[reminder.reminder_type] ?? reminder.reminder_type) : ""}
    subtitle={reminder ? `לקוח #${reminder.client_id}` : undefined}
    onClose={onClose}
  >
    {reminder && (
      <>
        <DrawerSection title="פרטי תזכורת">
          <DrawerField label="סוג" value={reminderTypeLabels[reminder.reminder_type] ?? reminder.reminder_type} />
          <DrawerField label="לקוח" value={`#${reminder.client_id}`} />
          <DrawerField
            label="סטטוס"
            value={
              <Badge variant={statusVariants[reminder.status]}>
                {statusLabels[reminder.status]}
              </Badge>
            }
          />
          <DrawerField label="הודעה" value={reminder.message} />
        </DrawerSection>

        <DrawerSection title="תזמון">
          <DrawerField label="תאריך יעד" value={formatDate(reminder.target_date)} />
          <DrawerField label="שליחה ב" value={formatDate(reminder.send_on)} />
          <DrawerField label="ימים לפני" value={`${reminder.days_before} ימים`} />
          <DrawerField label="נוצר" value={formatDateTime(reminder.created_at)} />
          {reminder.sent_at && (
            <DrawerField label="נשלח ב" value={formatDateTime(reminder.sent_at)} />
          )}
          {reminder.canceled_at && (
            <DrawerField label="בוטל ב" value={formatDateTime(reminder.canceled_at)} />
          )}
        </DrawerSection>

        {(reminder.binder_id ?? reminder.charge_id ?? reminder.tax_deadline_id) && (
          <DrawerSection title="קישור לרשומה">
            {reminder.binder_id && (
              <DrawerField label="קלסר" value={`#${reminder.binder_id}`} />
            )}
            {reminder.charge_id && (
              <DrawerField label="חשבונית" value={`#${reminder.charge_id}`} />
            )}
            {reminder.tax_deadline_id && (
              <DrawerField label="מועד מס" value={`#${reminder.tax_deadline_id}`} />
            )}
          </DrawerSection>
        )}
      </>
    )}
  </DetailDrawer>
);
ReminderDrawer.displayName = "ReminderDrawer";
