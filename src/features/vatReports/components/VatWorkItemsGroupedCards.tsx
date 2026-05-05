import { memo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/table/TableSkeleton'
import { PaginationCard } from '@/components/ui/table/PaginationCard'
import { DataTable, type Column } from '@/components/ui/table/DataTable'
import { MonthlyAccordionGroup, MonthlyAccordionList } from '@/components/ui/table/MonthlyAccordionGroup'
import { getTotalPages } from '@/utils/paginationUtils'
import { vatReportsApi, vatReportsQK } from '../api'
import type { VatWorkItemResponse, VatWorkItemGroupSummary } from '../api'
import { formatVatPeriodTitle } from '../view.helpers'

const getActivePeriodPrefix = (): string => {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const isActivePeriod = (period: string): boolean => period.startsWith(getActivePeriodPrefix())

interface VatWorkItemsGroupedCardsProps {
  groups: VatWorkItemGroupSummary[]
  columns: Column<VatWorkItemResponse>[]
  isLoading?: boolean
  error?: string | null
  onRowClick: (item: VatWorkItemResponse) => void
  emptyState?: { title?: string; message?: string; action?: { label: string; onClick: () => void } }
}

const PAGE_SIZE = 50

const GroupContent = memo(
  ({
    group,
    columns,
    onRowClick,
  }: {
    group: VatWorkItemGroupSummary
    columns: Column<VatWorkItemResponse>[]
    onRowClick: (item: VatWorkItemResponse) => void
  }) => {
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
      queryKey: vatReportsQK.groupItems(group.period, { page, page_size: PAGE_SIZE }),
      queryFn: () => vatReportsApi.listGroupItems(group.period, { page, page_size: PAGE_SIZE }),
      staleTime: 30_000,
    })

    if (isLoading) return <TableSkeleton rows={3} columns={columns.length} />

    return (
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
    )
  },
)

GroupContent.displayName = 'GroupContent'

export const VatWorkItemsGroupedCards = ({
  groups,
  columns,
  isLoading,
  error,
  onRowClick,
  emptyState,
}: VatWorkItemsGroupedCardsProps) => {
  const sortedGroups = [...groups].sort((a, b) => a.period.localeCompare(b.period))

  return (
    <MonthlyAccordionList
      isLoading={isLoading}
      isEmpty={groups.length === 0}
      emptyState={{
        icon: Inbox,
        title: emptyState?.title ?? 'אין תיקי מע"מ',
        message: emptyState?.message ?? 'לא נמצאו תיקים התואמים לסינון',
        action: emptyState?.action,
      }}
    >
      {error && <div className="text-sm text-negative-600">{error}</div>}
      {sortedGroups.map((group) => {
        const isCurrent = isActivePeriod(group.period)
        const summary = `${group.total_count} תיקים · ${group.pending_count} ממתינים · ${group.filed_count} הוגשו`
        return (
          <MonthlyAccordionGroup
            key={group.period}
            title={formatVatPeriodTitle(group.period, group.period_type)}
            summary={summary}
            isCurrent={isCurrent}
            defaultOpen={isCurrent}
          >
            <GroupContent group={group} columns={columns} onRowClick={onRowClick} />
          </MonthlyAccordionGroup>
        )
      })}
    </MonthlyAccordionList>
  )
}

VatWorkItemsGroupedCards.displayName = 'VatWorkItemsGroupedCards'
