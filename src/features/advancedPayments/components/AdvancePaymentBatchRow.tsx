import { useState } from 'react'
import { ChevronDown, ChevronLeft, AlertTriangle, MoreVertical, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { MONTH_NAMES } from '@/constants/periodOptions.constants'
import type { MonthBatchSummary, AdvancePaymentOverviewRow, AdvancePaymentStatus } from '../types'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import { fmtCurrency } from '../utils'
import { formatDate, formatClientOfficeId } from '../../../utils/utils'
import { AdvancePaymentStatusBadge } from './AdvancePaymentStatusBadge'

const COL_COUNT = 10

interface AdvancePaymentBatchRowProps {
  batch: MonthBatchSummary
  search: string
  statusFilter: AdvancePaymentStatus | ''
  periodFilter: 1 | 2 | null
  onRowClick: (row: AdvancePaymentOverviewRow) => void
}

export const AdvancePaymentBatchRow: React.FC<AdvancePaymentBatchRowProps> = ({
  batch,
  search,
  statusFilter,
  periodFilter,
  onRowClick,
}) => {
  const [open, setOpen] = useState(false)
  const monthName = MONTH_NAMES[batch.month - 1]

  const statusParam = statusFilter ? [statusFilter] : undefined

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
      <tr
        className="bg-gray-50/70 cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <td colSpan={COL_COUNT} className="px-5 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 flex-shrink-0">
              {open ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </span>
            <span className="font-bold text-sm text-gray-900 min-w-[90px]">
              {monthName} {batch.year}
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-xs text-gray-500">
              <span>
                <span className="font-semibold text-gray-800">{batch.client_count}</span> לקוחות
              </span>
              <span className="w-px h-3 bg-gray-200 hidden sm:block" />
              <span>
                צפוי:{' '}
                <span className="font-semibold text-gray-800">{fmtCurrency(batch.total_expected)}</span>
              </span>
              <span className="w-px h-3 bg-gray-200 hidden sm:block" />
              <span>
                גבייה: <span className="font-semibold text-gray-800">{batch.collection_rate.toFixed(0)}%</span>
              </span>
              {batch.missing_turnover_count > 0 && (
                <>
                  <span className="w-px h-3 bg-gray-200 hidden sm:block" />
                  <span className="text-red-600">
                    חוסרים: <span className="font-semibold">{batch.missing_turnover_count}</span>
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
            <tr>
              <td colSpan={COL_COUNT} className="py-8 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={COL_COUNT} className="py-6 text-center text-sm text-gray-400">
                אין תוצאות
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                onClick={() => onRowClick(row)}
              >
                <td className="px-5 py-3.5 text-sm text-gray-400 tabular-nums">
                  {formatClientOfficeId(row.office_client_number)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-sm text-gray-900">{row.business_name}</div>
                  {row.missing_turnover && (
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      חסר מחזור
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500 tabular-nums">
                  {formatDate(row.due_date)}
                </td>
                <td className="px-5 py-3.5 text-sm tabular-nums text-gray-700 text-left">
                  {row.reported_turnover ? (
                    fmtCurrency(row.reported_turnover)
                  ) : row.live_turnover ? (
                    <span className="text-gray-400">{fmtCurrency(row.live_turnover)}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold tabular-nums text-gray-900 text-left">
                  {fmtCurrency(row.expected_amount)}
                </td>
                <td className="px-5 py-3.5 text-sm tabular-nums text-gray-700 text-left">
                  {fmtCurrency(row.paid_amount)}
                </td>
                <td className="px-5 py-3.5 text-sm tabular-nums font-medium text-left">
                  {row.delta == null ? (
                    <span className="text-gray-300">—</span>
                  ) : (
                    <span className={Number(row.delta) > 0 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                      {fmtCurrency(row.delta)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400 tabular-nums text-left">—</td>
                <td className="px-5 py-3.5">
                  <AdvancePaymentStatusBadge status={row.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRowClick(row)
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </>
      )}
    </>
  )
}

AdvancePaymentBatchRow.displayName = 'AdvancePaymentBatchRow'
