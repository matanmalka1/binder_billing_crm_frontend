import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DataTable, type Column } from '../../../components/ui/table/DataTable'
import { Badge } from '../../../components/ui/primitives/Badge'
import { TruncateText } from '../../../components/ui/primitives/TruncateText'
import { formatClientOfficeId, formatDate } from '../../../utils/utils'
import type { Reminder } from '../types'
import { statusLabels, reminderStatusVariants } from '../types'
import { getReminderDisplayLabel } from '../utils'
import { ReminderRowActions } from './ReminderRowActions'

interface RemindersTableProps {
  reminders: Reminder[]
  cancelingId: number | null
  markingSentId: number | null
  onCancel: (id: number) => void
  onMarkSent: (id: number) => void
  onViewDetails: (reminder: Reminder) => void
  onRowClick?: (reminder: Reminder) => void
  showClient?: boolean
}

const clientColumns: Column<Reminder>[] = [
  {
    key: 'office_client_number',
    header: "מס' לקוח",
    render: (reminder) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">
        {formatClientOfficeId(reminder.office_client_number)}
      </span>
    ),
  },
  {
    key: 'client',
    header: 'לקוח',
    render: (reminder) => (
      <div>
        {reminder.client_record_id != null ? (
          <Link
            to={`/clients/${reminder.client_record_id}`}
            className="block truncate text-sm font-medium text-gray-700 hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {reminder.client_name ?? 'ללא שם לקוח'}
          </Link>
        ) : (
          <span className="block truncate text-sm font-medium text-gray-700">
            {reminder.client_name ?? 'ללא שם לקוח'}
          </span>
        )}
        {(reminder.business_name || reminder.business_id != null) && (
          <span className="block truncate text-xs text-gray-400">
            {reminder.business_name ?? `עסק #${reminder.business_id}`}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'client_id_number',
    header: 'ת.ז / ח.פ',
    render: (reminder) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">{reminder.client_id_number ?? '—'}</span>
    ),
  },
]

export const RemindersTable: React.FC<RemindersTableProps> = ({
  reminders,
  cancelingId,
  markingSentId,
  onCancel,
  onMarkSent,
  onViewDetails,
  onRowClick,
  showClient = true,
}) => {
  const columns: Column<Reminder>[] = [
    {
      key: 'type',
      header: 'סוג',
      render: (r) => <Badge variant="info">{getReminderDisplayLabel(r)}</Badge>,
    },
    ...(showClient ? clientColumns : []),
    {
      key: 'message',
      header: 'הודעה',
      render: (r) => <TruncateText text={r.message} maxWidth="max-w-xs" className="text-gray-700" />,
    },
    {
      key: 'target_date',
      header: 'תאריך יעד',
      render: (r) => (
        <div>
          <div className="text-sm tabular-nums text-gray-700">{formatDate(r.target_date)}</div>
          <div className="text-xs text-gray-400">{r.days_before} ימים לפני</div>
        </div>
      ),
    },
    {
      key: 'send_on',
      header: 'שליחה ב',
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm tabular-nums text-gray-500">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          {formatDate(r.send_on)}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (r) => (
        <Badge variant={reminderStatusVariants[r.status as keyof typeof reminderStatusVariants] ?? 'neutral'}>
          {statusLabels[r.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-10',
      className: 'w-10',
      render: (r) => (
        <ReminderRowActions
          reminder={r}
          cancelingId={cancelingId}
          markingSentId={markingSentId}
          onCancel={onCancel}
          onMarkSent={onMarkSent}
          onViewDetails={onViewDetails}
        />
      ),
    },
  ]

  return (
    <DataTable
      data={reminders}
      columns={columns}
      getRowKey={(r) => r.id}
      onRowClick={onRowClick}
      emptyMessage="אין תזכורות להצגה"
    />
  )
}
