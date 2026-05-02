import { useState } from 'react'
import { ChevronDown, ChevronLeft, AlertTriangle, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { MONTH_NAMES } from '@/constants/periodOptions.constants'
import type { MonthBatchSummary, AdvancePaymentOverviewRow } from '../types'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import { fmtCurrency } from '../utils'
import { formatDate, formatClientOfficeId } from '../../../utils/utils'
import { AdvancePaymentStatusBadge } from './AdvancePaymentStatusBadge'
import { AdvancePaymentTimingBadge } from './AdvancePaymentTimingBadge'
import { Loader2 } from 'lucide-react'

interface AdvancePaymentBatchRowProps {
  batch: MonthBatchSummary
  onRowClick: (row: AdvancePaymentOverviewRow) => void
}

export const AdvancePaymentBatchRow: React.FC<AdvancePaymentBatchRowProps> = ({
  batch,
  onRowClick,
}) => {
  const [open, setOpen] = useState(false)
  const monthName = MONTH_NAMES[batch.month - 1]

  const { data, isLoading } = useQuery({
    queryKey: advancedPaymentsQK.overview({ year: batch.year, month: batch.month, page_size: 200 }),
    queryFn: () =>
      advancePaymentsApi.overview({ year: batch.year, month: batch.month, page_size: 200 }),
    enabled: open,
  })

  const rows = data?.items ?? []
  const missingFirst = [...rows].sort((a, b) => (b.missing_turnover ? 1 : 0) - (a.missing_turnover ? 1 : 0))

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-right"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-gray-400">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </span>

        <span className="font-semibold text-gray-900 min-w-[80px]">
          {monthName} {batch.year}
        </span>

        <span className="text-sm text-gray-500">{batch.client_count} לקוחות</span>

        {batch.missing_turnover_count > 0 && (
          <span className="flex items-center gap-1 text-sm text-warning-700 bg-warning-50 border border-warning-200 rounded px-2 py-0.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            {batch.missing_turnover_count} חסרי מחזור
          </span>
        )}

        {batch.overdue_count > 0 && (
          <span className="flex items-center gap-1 text-sm text-error-700 bg-error-50 border border-error-200 rounded px-2 py-0.5">
            <Clock className="h-3.5 w-3.5" />
            {batch.overdue_count} באיחור
          </span>
        )}

        <span className="mr-auto flex items-center gap-4 text-sm tabular-nums">
          <span className="text-gray-500">צפוי: <span className="font-medium text-gray-800">{fmtCurrency(batch.total_expected)}</span></span>
          <span className="text-gray-500">שולם: <span className="font-medium text-positive-700">{fmtCurrency(batch.total_paid)}</span></span>
          <span className="text-gray-500">גבייה: <span className="font-semibold">{batch.collection_rate.toFixed(0)}%</span></span>
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="px-4 py-2 text-right font-medium">מס׳ לקוח</th>
                  <th className="px-4 py-2 text-right font-medium">שם עסק</th>
                  <th className="px-4 py-2 text-right font-medium">תאריך יעד</th>
                  <th className="px-4 py-2 text-right font-medium">מחזור</th>
                  <th className="px-4 py-2 text-right font-medium">צפוי</th>
                  <th className="px-4 py-2 text-right font-medium">שולם</th>
                  <th className="px-4 py-2 text-right font-medium">יתרה</th>
                  <th className="px-4 py-2 text-right font-medium">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {missingFirst.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onRowClick(row)}
                  >
                    <td className="px-4 py-2.5 font-mono text-gray-500 tabular-nums">
                      {formatClientOfficeId(row.office_client_number)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{row.business_name}</span>
                        {row.missing_turnover && (
                          <span className="flex items-center gap-1 text-xs text-warning-700 bg-warning-50 border border-warning-200 rounded px-1.5 py-0.5">
                            <AlertTriangle className="h-3 w-3" />
                            חסר מחזור
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 tabular-nums">{formatDate(row.due_date)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-gray-700">
                      {row.reported_turnover
                        ? fmtCurrency(row.reported_turnover)
                        : row.live_turnover
                          ? <span className="text-gray-500">{fmtCurrency(row.live_turnover)}</span>
                          : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-gray-700">{fmtCurrency(row.expected_amount)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-positive-700 font-semibold">{fmtCurrency(row.paid_amount)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">
                      {row.delta == null ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <span className={Number(row.delta) > 0 ? 'text-error-600' : 'text-gray-700'}>
                          {fmtCurrency(row.delta)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <AdvancePaymentStatusBadge status={row.status} />
                        <AdvancePaymentTimingBadge timingStatus={row.timing_status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

AdvancePaymentBatchRow.displayName = 'AdvancePaymentBatchRow'
