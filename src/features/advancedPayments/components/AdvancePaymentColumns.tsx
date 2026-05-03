import { MessageSquare, Trash2, Loader2 } from 'lucide-react'
import type { Column } from '../../../components/ui/table/DataTable'
import type { AdvancePaymentRow } from '../types'
import { MonoValue } from '../../../components/ui/primitives/MonoValue'
import { formatDate } from '../../../utils/utils'
import { fmtCurrency, getAdvancePaymentMonthLabel } from '../utils'
import { AdvancePaymentStatusBadge } from './AdvancePaymentStatusBadge'
import { AdvancePaymentTimingBadge } from './AdvancePaymentTimingBadge'
import { getDeltaTone } from './advancePaymentComponent.utils'
import { Button } from '../../../components/ui/primitives/Button'

interface BuildColumnsOptions {
  canEdit?: boolean
  showBusinessName?: boolean
  deletingId?: number | null
  onDelete?: (id: number) => void
}

export const buildAdvancePaymentColumns = (
  options: BuildColumnsOptions = {},
): Column<AdvancePaymentRow>[] => {
  const { canEdit = false, showBusinessName = false, deletingId, onDelete } = options

  const base: Column<AdvancePaymentRow>[] = [
    {
      key: 'period',
      header: 'תקופה',
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">
          {getAdvancePaymentMonthLabel(row.period, row.period_months_count)}
        </span>
      ),
    },
    {
      key: 'reported_turnover',
      header: 'מחזור',
      render: (row) => {
        const turnover = row.reported_turnover ?? row.live_turnover
        if (!turnover) return <span className="text-gray-300 text-sm">—</span>
        return <MonoValue value={fmtCurrency(turnover)} tone="neutral" />
      },
    },
    {
      key: 'expected_amount',
      header: 'צפוי',
      render: (row) => <MonoValue value={fmtCurrency(row.expected_amount)} />,
    },
    {
      key: 'paid_amount',
      header: 'שולם',
      render: (row) => <MonoValue value={fmtCurrency(row.paid_amount)} tone="positive" />,
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <AdvancePaymentStatusBadge status={row.status} />
          <AdvancePaymentTimingBadge timingStatus={row.timing_status} paidLate={row.paid_late} />
        </div>
      ),
    },
    {
      key: 'due_date',
      header: 'תאריך תשלום',
      render: (row) => (
        <span className="text-sm text-gray-500 tabular-nums">{formatDate(row.due_date)}</span>
      ),
    },
    {
      key: 'delta',
      header: 'הפרש',
      render: (row) => {
        if (row.delta == null) return <span className="text-gray-400 text-sm">—</span>
        return <MonoValue value={fmtCurrency(row.delta)} tone={getDeltaTone(row.delta)} />
      },
    },
    {
      key: 'notes',
      header: '',
      render: (row) =>
        row.notes ? (
          <span title={row.notes} className="text-gray-400 hover:text-gray-600 cursor-default">
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
        ) : null,
    },
  ]

  if (showBusinessName) {
    base.splice(1, 0, {
      key: 'business_name',
      header: 'עסק',
      render: (row) => <span className="text-sm text-gray-700">{row.business_name || '—'}</span>,
    })
  }

  if (canEdit && onDelete) {
    base.push({
      key: 'actions',
      header: '',
      headerClassName: 'w-10',
      className: 'w-10',
      render: (row) =>
        deletingId === row.id ? (
          <Loader2 size={14} className="animate-spin text-gray-400" />
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-1 py-1 text-gray-400 hover:text-error-600 hover:bg-error-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(row.id)
            }}
            aria-label="מחק"
          >
            <Trash2 size={14} />
          </Button>
        ),
    })
  }

  return base
}
