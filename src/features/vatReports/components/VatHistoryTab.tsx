import { useState } from 'react'
import { Button } from '../../../components/ui/primitives/Button'
import { formatDateTime } from '../../../utils/utils'
import { ACTION_LABELS, PAGE_SIZE } from '../history.constants'
import { formatVatHistoryDetails } from '../history.utils'
import { useVatHistory } from '../hooks/useVatHistory'
import type { VatHistoryTabProps } from '../types'

export const VatHistoryTab: React.FC<VatHistoryTabProps> = ({ workItemId }) => {
  const [page, setPage] = useState(0)
  const { items, total, isFetching, isPending } = useVatHistory(workItemId, page, PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const maxPage = totalPages - 1
  const safePage = Math.min(page, maxPage)

  if (isPending) return <p className="py-8 text-center text-sm text-gray-400">טוען...</p>
  if (total === 0) return <p className="py-8 text-center text-sm text-gray-400">אין היסטוריה</p>

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-gray-100" dir="rtl">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-right">תאריך</th>
              <th className="px-4 py-3 text-right">פעולה</th>
              <th className="px-4 py-3 text-right">פרטים</th>
              <th className="px-4 py-3 text-right">בוצע ע&quot;י</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 text-gray-500 tabular-nums whitespace-nowrap">
                  {formatDateTime(entry.performed_at)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{ACTION_LABELS[entry.action] ?? entry.action}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{formatVatHistoryDetails(entry)}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {entry.performed_by_name ?? `#${entry.performed_by}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500" dir="rtl">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0 || isFetching}
          >
            הקודם
          </Button>
          <span>{isFetching ? 'טוען...' : `עמוד ${safePage + 1} מתוך ${totalPages}`}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={safePage >= maxPage || isFetching}
          >
            הבא
          </Button>
        </div>
      )}
    </div>
  )
}

VatHistoryTab.displayName = 'VatHistoryTab'
