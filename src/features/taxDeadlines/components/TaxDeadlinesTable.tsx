import { useMemo } from 'react'
import { Inbox } from 'lucide-react'
import { GroupSection } from '../../../components/ui/primitives/GroupSection'
import { DataTable, type Column } from '../../../components/ui/table/DataTable'
import { TaxDeadlineRowActions } from './TaxDeadlineRowActions'
import type { TaxDeadlineResponse } from '../api'
import { getDeadlineTypeLabel } from '../api'
import { formatClientOfficeId } from '../../../utils/utils'
import {
  DeadlineDateCell,
  DeadlineDateWithUrgencyCell,
  DeadlineStatusBadge,
  DeadlineUrgencyBadge,
} from './TaxDeadlineTableParts'
import { getDeadlineRowClassName } from './taxDeadlineTableUtils'
import { getTaxDeadlinePeriodLabel, groupTaxDeadlinesByMonth } from '../utils'

interface TaxDeadlinesTableProps {
  deadlines: TaxDeadlineResponse[]
  isLoading?: boolean
  clientScoped?: boolean
  onComplete?: (id: number) => void
  onReopen?: (id: number) => void
  completingId: number | null
  reopeningId?: number | null
  onRowClick?: (deadline: TaxDeadlineResponse) => void
  onEdit?: (deadline: TaxDeadlineResponse) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
}

export const TaxDeadlinesTable = ({
  deadlines,
  isLoading,
  clientScoped = false,
  onComplete,
  onReopen,
  completingId,
  reopeningId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: TaxDeadlinesTableProps) => {
  const columns = useMemo<Column<TaxDeadlineResponse>[]>(
    () => [
      ...(!clientScoped
        ? [
            {
              key: 'office_client_number',
              header: "מס' לקוח",
              render: (deadline: TaxDeadlineResponse) => (
                <span className="font-mono text-sm text-gray-500 tabular-nums">
                  {formatClientOfficeId(deadline.office_client_number)}
                </span>
              ),
            },
            {
              key: 'client_name',
              header: 'לקוח',
              render: (deadline: TaxDeadlineResponse) => (
                <span className="block max-w-[220px] truncate text-sm font-semibold text-gray-900">
                  {deadline.client_name ?? `לקוח #${deadline.client_record_id}`}
                </span>
              ),
            },
          ]
        : []),
      {
        key: 'deadline_type',
        header: 'סוג',
        render: (deadline) => (
          <span className="text-sm text-gray-500">{getDeadlineTypeLabel(deadline.deadline_type)}</span>
        ),
      },
      {
        key: 'period',
        header: 'תקופה',
        render: (deadline) => <span className="text-sm text-gray-500">{getTaxDeadlinePeriodLabel(deadline)}</span>,
      },
      {
        key: 'due_date',
        header: 'מועד',
        render: (deadline) =>
          clientScoped ? (
            <DeadlineDateWithUrgencyCell deadline={deadline} />
          ) : (
            <DeadlineDateCell dueDate={deadline.due_date} />
          ),
      },
      ...(!clientScoped
        ? [
            {
              key: 'urgency',
              header: 'דחיפות',
              render: (deadline: TaxDeadlineResponse) => <DeadlineUrgencyBadge deadline={deadline} />,
            },
          ]
        : []),
      {
        key: 'status',
        header: 'סטטוס',
        render: (deadline) => <DeadlineStatusBadge status={deadline.status} />,
      },
      {
        key: 'actions',
        header: '',
        headerClassName: clientScoped ? 'w-64' : 'w-10',
        className: clientScoped ? 'w-64' : 'w-10',
        render: (deadline) => (
          <TaxDeadlineRowActions
            deadline={deadline}
            completingId={completingId}
            reopeningId={reopeningId}
            deletingId={deletingId}
            onComplete={onComplete}
            onReopen={onReopen}
            onEdit={onEdit}
            onDelete={onDelete}
            clientScoped={clientScoped}
          />
        ),
      },
    ],
    [clientScoped, completingId, deletingId, onComplete, onDelete, onEdit, onReopen, reopeningId],
  )

  const groups = useMemo(() => groupTaxDeadlinesByMonth(deadlines), [deadlines])

  if (isLoading || deadlines.length === 0) {
    return (
      <DataTable
        data={[]}
        columns={columns}
        getRowKey={(d) => d.id}
        isLoading={isLoading}
        emptyState={{
          icon: Inbox,
          title: 'אין מועדים להצגה',
          message: 'לא נמצאו מועדי מס התואמים לסינון הנוכחי',
          variant: 'illustration',
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupSection key={group.key} label={group.label} count={group.items.length}>
          <DataTable
            data={group.items}
            columns={columns}
            getRowKey={(d) => d.id}
            onRowClick={onRowClick}
            rowClassName={getDeadlineRowClassName}
          />
        </GroupSection>
      ))}
    </div>
  )
}

TaxDeadlinesTable.displayName = 'TaxDeadlinesTable'
