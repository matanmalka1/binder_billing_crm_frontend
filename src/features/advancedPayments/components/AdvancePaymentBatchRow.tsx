import { ChevronDown, ChevronLeft, AlertTriangle, ExternalLink, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MONTH_NAMES } from '@/constants/periodOptions.constants'
import type { MonthBatchSummary, AdvancePaymentOverviewRow, AdvancePaymentStatus } from '../types'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import { fmtCurrency } from '../utils'
import { formatDate, formatClientOfficeId } from '../../../utils/utils'
import { AdvancePaymentStatusBadge } from './AdvancePaymentStatusBadge'
import { RowActionsMenu, RowActionItem } from '../../../components/ui/table/RowActions'
import { SkeletonBlock } from '../../../components/ui/primitives/SkeletonBlock'

const COL_COUNT = 10

interface AdvancePaymentBatchRowProps {
  batch: MonthBatchSummary
  search: string
  statusFilter: AdvancePaymentStatus | ''
  periodFilter: 1 | 2 | null
  open: boolean
  onToggle: () => void
  onRowClick: (row: AdvancePaymentOverviewRow) => void
}

const SkeletonRow = () => (
  <tr className="border-t border-gray-100">
    {Array.from({ length: COL_COUNT }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBlock width={i === 1 ? 'w-32' : 'w-20'} height="h-3" />
      </td>
    ))}
  </tr>
)

export const AdvancePaymentBatchRow: React.FC<AdvancePaymentBatchRowProps> = ({
  batch,
  search,
  statusFilter,
  periodFilter,
  open,
  onToggle,
  onRowClick,
}) => {
  const monthName = MONTH_NAMES[batch.month - 1]
  const statusParam = statusFilter ? [statusFilter] : undefined
  const collectionPct = Math.min(Math.max(batch.collection_rate, 0), 100)

  const { data, isLoading } = useQuery({
    queryKey: advancedPaymentsQK.overview({
      year: batch.year,
      month: batch.month,
      page_size: 200,
      status: statusParam,
    }),
    queryFn: () =>
      advancePaymentsApi.overview({
        year: batch.year,
        month: batch.month,
        page_size: 200,
        status: statusParam,
      }),
    enabled: open,
  })

  const rows = data?.items ?? []
  const filtered = rows.filter((r) => {
    if (search && !r.business_name.toLowerCase().includes(search.toLowerCase())) return false
    if (periodFilter !== null && r.period_months_count !== periodFilter) return false
    return true
  })
  const sorted = [...filtered].sort(
    (a, b) => (b.missing_turnover ? 1 : 0) - (a.missing_turnover ? 1 : 0),
  )

  return (
    <>
      {/* Group header */}
      <tr
        className="cursor-pointer select-none bg-gray-50 hover:bg-gray-100/80 transition-colors border-t border-gray-200"
        onClick={onToggle}
      >
        <td colSpan={COL_COUNT} className="px-3 py-1.5">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 flex-shrink-0">
              {open ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="font-semibold text-sm text-gray-800 min-w-[100px]">
              {monthName} {batch.year}
            </span>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{batch.client_count} לקוחות</span>
              <span className="text-gray-300">·</span>
              <span>
                צפוי:{' '}
                <span className="font-medium text-gray-700">
                  {fmtCurrency(batch.total_expected)}
                </span>
              </span>
              <span className="text-gray-300">·</span>
              {/* Mini progress */}
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-700">{collectionPct.toFixed(0)}%</span>
                <span className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <span
                    className="h-full rounded-full bg-blue-400 block transition-all duration-500"
                    style={{ width: `${collectionPct}%` }}
                  />
                </span>
              </span>
              {batch.missing_turnover_count > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    {batch.missing_turnover_count} חסרי מחזור
                  </span>
                </>
              )}
            </div>
          </div>
        </td>
      </tr>

      {open && (
        <>
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={COL_COUNT} className="py-5 text-center text-sm text-gray-400">
                אין תוצאות
              </td>
            </tr>
          ) : (
            sorted.map((row) => {
              const isOverdue = row.timing_status === 'overdue'
              return (
                <tr
                  key={row.id}
                  className={`border-t border-gray-100 cursor-pointer transition-colors ${
                    isOverdue ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-blue-50/40'
                  }`}
                  onClick={() => onRowClick(row)}
                >
                  {/* # לקוח */}
                  <td className="px-3 py-1.5 text-sm text-gray-400 tabular-nums align-middle">
                    {formatClientOfficeId(row.office_client_number)}
                  </td>

                  {/* שם עסק */}
                  <td className="px-3 py-1.5 align-middle">
                    <Link
                      to={`/clients/${row.client_record_id}/advance-payments`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline leading-snug block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.business_name}
                    </Link>
                    {row.missing_turnover && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        חסר מחזור
                      </span>
                    )}
                  </td>

                  {/* תאריך יעד */}
                  <td
                    className={`px-3 py-1.5 text-sm tabular-nums whitespace-nowrap align-middle ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}
                  >
                    {formatDate(row.due_date)}
                  </td>

                  {/* מחזור */}
                  <td className="px-3 py-1.5 text-sm tabular-nums text-left align-middle">
                    {row.reported_turnover ? (
                      <span className="text-gray-700">{fmtCurrency(row.reported_turnover)}</span>
                    ) : row.live_turnover ? (
                      <span className="text-gray-400 italic">{fmtCurrency(row.live_turnover)}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* צפוי */}
                  <td className="px-3 py-1.5 text-sm font-semibold tabular-nums text-gray-800 text-left align-middle">
                    {fmtCurrency(row.expected_amount)}
                  </td>

                  {/* שולם */}
                  <td className="px-3 py-1.5 text-sm tabular-nums text-gray-600 text-left align-middle">
                    {fmtCurrency(row.paid_amount)}
                  </td>

                  {/* יתרה */}
                  <td className="px-3 py-1.5 text-sm tabular-nums text-left align-middle">
                    {row.delta == null ? (
                      <span className="text-gray-300">—</span>
                    ) : Number(row.delta) > 0 ? (
                      <span className="font-semibold text-red-500">{fmtCurrency(row.delta)}</span>
                    ) : (
                      <span className="text-gray-500">{fmtCurrency(row.delta)}</span>
                    )}
                  </td>

                  {/* אחוז מקדמה */}
                  <td className="px-3 py-1.5 text-sm tabular-nums text-gray-600 text-left align-middle">
                    {row.advance_rate != null ? (
                      `${Number(row.advance_rate).toFixed(2)}%`
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* סטטוס */}
                  <td className="px-3 py-1.5 text-center align-middle">
                    <AdvancePaymentStatusBadge status={row.status} />
                  </td>

                  {/* פעולות */}
                  <td className="px-3 py-1.5 align-middle" onClick={(e) => e.stopPropagation()}>
                    <RowActionsMenu ariaLabel={`פעולות למקדמה ${row.id}`}>
                      <RowActionItem
                        label="עדכן תשלום"
                        icon={<Edit className="h-3.5 w-3.5" />}
                        onClick={() => onRowClick(row)}
                      />
                      <RowActionItem
                        label="עבור ללקוח"
                        icon={<ExternalLink className="h-3.5 w-3.5" />}
                        onClick={() =>
                          window.open(`/clients/${row.client_record_id}/advance-payments`, '_self')
                        }
                      />
                    </RowActionsMenu>
                  </td>
                </tr>
              )
            })
          )}
        </>
      )}
    </>
  )
}

AdvancePaymentBatchRow.displayName = 'AdvancePaymentBatchRow'
