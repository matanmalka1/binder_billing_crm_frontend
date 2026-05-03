import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GroupSection } from '@/components/ui/primitives/GroupSection'
import { formatClientOfficeId } from '@/utils/utils'
import type { Reminder } from '../types'
import { groupRemindersByClient } from '../utils'
import { RemindersTable } from './RemindersTable'

interface RemindersByClientListProps {
  reminders: Reminder[]
  cancelingId: number | null
  markingSentId: number | null
  onCancel: (id: number) => void
  onMarkSent: (id: number) => void
  onViewDetails: (reminder: Reminder) => void
  onRowClick?: (reminder: Reminder) => void
}

export const RemindersByClientList: React.FC<RemindersByClientListProps> = ({
  reminders,
  cancelingId,
  markingSentId,
  onCancel,
  onMarkSent,
  onViewDetails,
  onRowClick,
}) => {
  const groups = useMemo(() => groupRemindersByClient(reminders), [reminders])

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const subInfo = [
          group.officeClientNumber != null
            ? `מס' לקוח: ${formatClientOfficeId(group.officeClientNumber)}`
            : null,
          group.clientIdNumber ? `ת.ז / ח.פ: ${group.clientIdNumber}` : null,
        ]
          .filter(Boolean)
          .join(' · ')

        const label = group.clientRecordId != null ? (
          <Link
            to={`/clients/${group.clientRecordId}`}
            className="truncate hover:underline"
          >
            {group.clientName}
          </Link>
        ) : (
          group.clientName
        )

        const meta = subInfo ? (
          <span className="text-xs text-gray-500">{subInfo}</span>
        ) : undefined

        return (
          <GroupSection
            key={group.key}
            label={label}
            count={group.reminders.length}
            countLabel="תזכורות"
            meta={meta}
            collapsible
          >
            <RemindersTable
              reminders={group.reminders}
              cancelingId={cancelingId}
              markingSentId={markingSentId}
              onCancel={onCancel}
              onMarkSent={onMarkSent}
              onViewDetails={onViewDetails}
              onRowClick={onRowClick}
              showClient={false}
            />
          </GroupSection>
        )
      })}
    </div>
  )
}

RemindersByClientList.displayName = 'RemindersByClientList'
