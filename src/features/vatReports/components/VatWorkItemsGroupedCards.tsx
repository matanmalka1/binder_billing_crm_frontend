import { memo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Inbox, Users } from 'lucide-react'
import { Card } from '@/components/ui/primitives/Card'
import { Badge } from '@/components/ui/primitives/Badge'
import { StateCard } from '@/components/ui/feedback/StateCard'
import { TableSkeleton } from '@/components/ui/table/TableSkeleton'
import { PaginationCard } from '@/components/ui/table/PaginationCard'
import { DataTable, type Column } from '@/components/ui/table/DataTable'
import { getTotalPages } from '@/utils/paginationUtils'
import { cn } from '@/utils/utils'
import { vatReportsApi, vatReportsQK } from '../api'
import type { VatWorkItemResponse, VatWorkItemGroupSummary } from '../api'
import { formatVatPeriodTitle } from '../view.helpers'

interface VatWorkItemsGroupedCardsProps {
  groups: VatWorkItemGroupSummary[]
  columns: Column<VatWorkItemResponse>[]
  isLoading?: boolean
  error?: string | null
  onRowClick: (item: VatWorkItemResponse) => void
  emptyState?: { title?: string; message?: string; action?: { label: string; onClick: () => void } }
}

const PAGE_SIZE = 50

const GroupCard = memo(({
  group,
  columns,
  onRowClick,
}: {
  group: VatWorkItemGroupSummary
  columns: Column<VatWorkItemResponse>[]
  onRowClick: (item: VatWorkItemResponse) => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: vatReportsQK.groupItems(group.period, { page, page_size: PAGE_SIZE }),
    queryFn: () => vatReportsApi.listGroupItems(group.period, { page, page_size: PAGE_SIZE }),
    enabled: expanded,
    staleTime: 30_000,
  })

  const allFiled = group.filed_count === group.total_count
  const hasPending = group.pending_count > 0

  return (
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        dir="rtl"
        className="flex w-full items-center gap-4 px-4 py-3 text-right hover:bg-gray-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      >
        <span className="text-gray-400">
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', !expanded && '-rotate-90')}
          />
        </span>

        <span className="min-w-[160px] text-sm font-semibold text-gray-900">
          {formatVatPeriodTitle(group.period, group.period_type)}
        </span>

        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users className="h-3.5 w-3.5" />
          {group.total_count} תיקים
        </span>

        <span className="flex gap-1.5">
          {hasPending && (
            <Badge variant="warning" className="text-xs">
              {group.pending_count} ממתינים לחומרים
            </Badge>
          )}
          {allFiled && (
            <Badge variant="success" className="text-xs">
              הוגש הכול
            </Badge>
          )}
          {!allFiled && !hasPending && group.filed_count > 0 && (
            <Badge variant="neutral" className="text-xs">
              {group.filed_count} / {group.total_count} הוגש
            </Badge>
          )}
        </span>

        <span className="mr-auto text-xs font-medium text-primary-600">
          {expanded ? 'סגור' : 'פתח תיקים'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {isLoading ? (
            <TableSkeleton rows={3} columns={columns.length} />
          ) : (
            <>
              <DataTable
                data={data?.items ?? []}
                columns={columns}
                getRowKey={(r) => r.id}
                onRowClick={onRowClick}
                emptyMessage="אין תיקים בתקופה זו"
              />
              {data && data.total > PAGE_SIZE && (
                <PaginationCard
                  page={page}
                  totalPages={getTotalPages(data.total, PAGE_SIZE)}
                  total={data.total}
                  label="תיקים"
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      )}
    </Card>
  )
})

export const VatWorkItemsGroupedCards = ({
  groups,
  columns,
  isLoading,
  error,
  onRowClick,
  emptyState,
}: VatWorkItemsGroupedCardsProps) => {
  if (isLoading) return <TableSkeleton rows={5} columns={columns.length} />

  if (groups.length === 0) {
    return (
      <StateCard
        icon={Inbox}
        title={emptyState?.title ?? 'אין תיקי מע"מ'}
        message={emptyState?.message ?? 'לא נמצאו תיקים התואמים לסינון'}
        action={emptyState?.action}
      />
    )
  }

  return (
    <div className="space-y-2">
      {error && <div className="text-sm text-negative-600">{error}</div>}
      {groups.map((group) => (
        <GroupCard key={group.period} group={group} columns={columns} onRowClick={onRowClick} />
      ))}
    </div>
  )
}

VatWorkItemsGroupedCards.displayName = 'VatWorkItemsGroupedCards'
