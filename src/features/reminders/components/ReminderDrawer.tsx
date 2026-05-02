import {
  DetailDrawer,
  DrawerField,
  DrawerSection,
} from '../../../components/ui/overlays/DetailDrawer'
import { Badge } from '../../../components/ui/primitives/Badge'
import type { Reminder } from '../api'
import { statusLabels, reminderStatusVariants } from '../types'
import { getReminderDisplayLabel } from '../utils'
import { formatClientOfficeId, formatDate, formatDateTime } from '../../../utils/utils'

interface ReminderDrawerProps {
  reminder: Reminder | null
  onClose: () => void
}

export const ReminderDrawer: React.FC<ReminderDrawerProps> = ({ reminder, onClose }) => (
  <DetailDrawer
    open={reminder !== null}
    title={reminder ? getReminderDisplayLabel(reminder) : ''}
    onClose={onClose}
  >
    {reminder && (
      <>
        <DrawerSection title="פרטי תזכורת">
          <DrawerField label="לקוח" value={reminder.client_name} />
          <DrawerField
            label="מס' לקוח "
            value={
              reminder.office_client_number != null
                ? formatClientOfficeId(reminder.office_client_number)
                : '—'
            }
          />
          <DrawerField label="ת.ז / ח.פ" value={reminder.client_id_number ?? '—'} />
          <DrawerField label="סוג" value={getReminderDisplayLabel(reminder)} />
          <DrawerField
            label="סטטוס"
            value={
              <Badge
                variant={
                  reminderStatusVariants[reminder.status as keyof typeof reminderStatusVariants] ??
                  'neutral'
                }
              >
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

        {reminder.binder_id && (
          <DrawerSection title="קישור לרשומה">
            {reminder.binder_id && <DrawerField label="קלסר" value={`#${reminder.binder_id}`} />}
          </DrawerSection>
        )}
      </>
    )}
  </DetailDrawer>
)
ReminderDrawer.displayName = 'ReminderDrawer'
