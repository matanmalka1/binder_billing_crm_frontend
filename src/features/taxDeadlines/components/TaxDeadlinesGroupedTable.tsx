import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, Inbox, Users } from 'lucide-react'
import { Card } from '../../../components/ui/primitives/Card'
import { Badge } from '../../../components/ui/primitives/Badge'
import { taxDeadlinesApi, taxDeadlinesQK, getDeadlineTypeLabel, formatCurrency, getUrgencyColor, calculateDaysRemaining } from '../api'
import type { DeadlineGroup, TaxDeadlineResponse, DeadlineUrgencyLevel } from '../api'
import { getTaxDeadlinePeriodLabel, getDeadlineDaysLabelShort } from '../utils'
import { cn } from '../../../utils/utils'

const DaysRemainingLabel = ({ dueDate, urgency }: { dueDate: string; urgency: DeadlineUrgencyLevel }) => {
  if (urgency === 'none') return null
  const days = calculateDaysRemaining(dueDate)
  const label = getDeadlineDaysLabelShort(days, false)
  return <span className="text-xs text-gray-400">{label}</span>
}
import { DeadlineDateCell, DeadlineStatusBadge, DeadlineAmountCell } from './TaxDeadlineTableParts'
import { TaxDeadlineRowActions } from './TaxDeadlineRowActions'
import { StateCard } from '../../../components/ui/feedback/StateCard'

interface TaxDeadlinesGroupedTableProps {
  groups: DeadlineGroup[]
  onComplete?: (id: number) => void
  onReopen?: (id: number) => void
  completingId: number | null
  reopeningId?: number | null
  onRowClick?: (deadline: TaxDeadlineResponse) => void
  onEdit?: (deadline: TaxDeadlineResponse) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
}

interface GroupRowProps {
  group: DeadlineGroup
  onComplete?: (id: number) => void
  onReopen?: (id: number) => void
  completingId: number | null
  reopeningId?: number | null
  onRowClick?: (deadline: TaxDeadlineResponse) => void
  onEdit?: (deadline: TaxDeadlineResponse) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
}

const ClientsSubTable = ({
  groupKey,
  onComplete,
  onReopen,
  completingId,
  reopeningId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: {
  groupKey: string
  onComplete?: (id: number) => void
  onReopen?: (id: number) => void
  completingId: number | null
  reopeningId?: number | null
  onRowClick?: (deadline: TaxDeadlineResponse) => void
  onEdit?: (deadline: TaxDeadlineResponse) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
}) => {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 50

  const { data, isLoading } = useQuery({
    queryKey: taxDeadlinesQK.groupClients(groupKey, { page, page_size: PAGE_SIZE }),
    queryFn: () => taxDeadlinesApi.listGroupClients(groupKey, { page, page_size: PAGE_SIZE }),
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (isLoading) {
    return <div className="py-4 text-center text-sm text-gray-400">טוען לקוחות...</div>
  }

  if (items.length === 0) {
    return <div className="py-4 text-center text-sm text-gray-400">אין לקוחות לקבוצה זו</div>
  }

  return (
    <div className="border-t border-gray-100">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-right">
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">לקוח</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">סכום</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">סטטוס</th>
            <th className="w-10 px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((d) => (
            <tr
              key={d.id}
              className={cn(
                'transition-colors duration-100',
                onRowClick && 'cursor-pointer hover:bg-primary-50/30',
                d.status === 'canceled' && 'opacity-50',
              )}
              onClick={() => onRowClick?.(d)}
            >
              <td className="px-4 py-2">
                <span className="block max-w-[240px] truncate font-medium text-gray-800">
                  {d.client_name ?? `לקוח #${d.client_record_id}`}
                </span>
              </td>
              <td className="px-4 py-2">
                <DeadlineAmountCell amount={d.payment_amount} status={d.status} />
              </td>
              <td className="px-4 py-2">
                <DeadlineStatusBadge status={d.status} />
              </td>
              <td className="px-4 py-2">
                <TaxDeadlineRowActions
                  deadline={d}
                  completingId={completingId}
                  reopeningId={reopeningId}
                  deletingId={deletingId}
                  onComplete={onComplete}
                  onReopen={onReopen}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-2 text-xs text-gray-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הקודם
          </button>
          <span>{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  )
}

const GroupRow = ({
  group,
  onComplete,
  onReopen,
  completingId,
  reopeningId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: GroupRowProps) => {
  const [expanded, setExpanded] = useState(false)

  const periodLabel = getTaxDeadlinePeriodLabel({
    deadline_type: group.deadline_type,
    period: group.period,
    tax_year: group.tax_year,
  })

  const allDone = group.pending_count === 0 && group.completed_count === group.total_clients

  return (
    <Card className={cn(
      'overflow-hidden p-0 transition-shadow',
      group.overdue_count > 0 && 'border-r-4 border-negative-500',
      group.worst_urgency === 'critical' && !group.overdue_count && 'border-r-4 border-negative-400',
      group.worst_urgency === 'warning' && !group.overdue_count && 'border-r-4 border-warning-400',
    )}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 px-4 py-3 text-right hover:bg-gray-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      >
        <span className="text-gray-400">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </span>

        <span className="min-w-[140px] text-sm font-semibold text-gray-900">
          {getDeadlineTypeLabel(group.deadline_type)}
        </span>

        <span className="min-w-[100px] text-sm text-gray-600">{periodLabel}</span>

        <span className="flex min-w-[160px] flex-col gap-0.5">
          <DeadlineDateCell dueDate={group.due_date} />
          <DaysRemainingLabel dueDate={group.due_date} urgency={group.worst_urgency} />
        </span>

        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users className="h-3.5 w-3.5" />
          <span>{group.total_clients} לקוחות</span>
        </span>

        <span className="flex gap-1.5">
          {group.overdue_count > 0 && (
            <Badge className={cn('border text-xs', getUrgencyColor('overdue'))}>
              {group.overdue_count} באיחור
            </Badge>
          )}
          {group.pending_count > 0 && group.overdue_count === 0 && (
            <Badge variant="warning" className="text-xs">
              {group.pending_count} ממתינים
            </Badge>
          )}
          {allDone && (
            <Badge variant="success" className="text-xs">הושלם</Badge>
          )}
        </span>

        <span className="mr-auto text-sm font-medium text-gray-700">
          {group.open_amount !== null
            ? formatCurrency(group.open_amount)
            : group.total_amount !== null
              ? formatCurrency(group.total_amount)
              : '—'}
        </span>

        <span className="text-xs text-primary-600 font-medium">
          {expanded ? 'סגור' : 'פתח לקוחות'}
        </span>
      </button>

      {expanded && (
        <ClientsSubTable
          groupKey={group.group_key}
          onComplete={onComplete}
          onReopen={onReopen}
          completingId={completingId}
          reopeningId={reopeningId}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={deletingId}
        />
      )}
    </Card>
  )
}

export const TaxDeadlinesGroupedTable = ({
  groups,
  onComplete,
  onReopen,
  completingId,
  reopeningId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: TaxDeadlinesGroupedTableProps) => {
  if (groups.length === 0) {
    return (
      <StateCard
        icon={Inbox}
        title="אין מועדים להצגה"
        message="לא נמצאו מועדי מס התואמים לסינון הנוכחי"
        variant="illustration"
      />
    )
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <GroupRow
          key={group.group_key}
          group={group}
          onComplete={onComplete}
          onReopen={onReopen}
          completingId={completingId}
          reopeningId={reopeningId}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={deletingId}
        />
      ))}
    </div>
  )
}

TaxDeadlinesGroupedTable.displayName = 'TaxDeadlinesGroupedTable'
