import { getYear } from 'date-fns'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  AdvancePaymentsFiltersBar,
  OverviewKPICards,
  useAdvancePaymentsOverview,
  type AdvancePaymentOverviewRow,
  type AdvancePaymentStatus,
  fmtCurrency,
} from '@/features/advancedPayments'
import { formatClientOfficeId } from '@/utils/utils'
import { Alert } from '@/components/ui/overlays/Alert'
import { DataTable, type Column } from '@/components/ui/table/DataTable'
import { PaginationCard } from '@/components/ui/table/PaginationCard'
import { formatDate, parsePositiveInt } from '@/utils/utils'
import { AdvancePaymentStatusBadge } from '../components/AdvancePaymentStatusBadge'
import { getAdvancePaymentMonthLabel } from '../utils'

const columns: Column<AdvancePaymentOverviewRow>[] = [
  {
    key: 'office_client_number',
    header: "מס' לקוח",
    render: (row) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">
        {formatClientOfficeId(row.office_client_number)}
      </span>
    ),
  },
  {
    key: 'business_name',
    header: 'לקוח',
    render: (row) => (
      <span className="text-sm font-semibold text-gray-900">{row.business_name}</span>
    ),
  },
  {
    key: 'period',
    header: 'חודש',
    render: (row) => (
      <span className="text-sm text-gray-700">
        {getAdvancePaymentMonthLabel(row.period, row.period_months_count)}
      </span>
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
    key: 'expected_amount',
    header: 'סכום צפוי',
    render: (row) => (
      <span className="font-mono text-sm font-medium text-gray-700 tabular-nums">
        {fmtCurrency(row.expected_amount)}
      </span>
    ),
  },
  {
    key: 'paid_amount',
    header: 'שולם',
    render: (row) => (
      <span className="font-mono text-sm font-semibold text-positive-700 tabular-nums">
        {fmtCurrency(row.paid_amount)}
      </span>
    ),
  },
  {
    key: 'delta',
    header: 'יתרה',
    render: (row) => {
      if (row.delta == null) return <span className="text-gray-400 text-sm tabular-nums">—</span>
      const n = Number(row.delta)
      const color = n < 0 ? 'text-negative-600' : 'text-gray-700'
      return (
        <span className={`font-mono text-sm tabular-nums ${color}`}>{fmtCurrency(row.delta)}</span>
      )
    },
  },
  {
    key: 'status',
    header: 'סטטוס',
    render: (row) => <AdvancePaymentStatusBadge status={row.status} />,
  },
]

export const AdvancePayments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const year = parsePositiveInt(searchParams.get('year'), getYear(new Date()))
  const month = parsePositiveInt(searchParams.get('month'), 0)
  const statusFilter = (searchParams.get('status') ?? '') as AdvancePaymentStatus | ''
  const page = parsePositiveInt(searchParams.get('page'), 1)

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const { rows, total, totalPages, isLoading, error, kpiData } = useAdvancePaymentsOverview({
    year,
    month,
    statusFilter,
    page,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="מקדמות"
        description="סקירה לפי שנה, חודש וסטטוס"
      />

      {!isLoading && kpiData && (
        <OverviewKPICards
          year={year}
          totalExpected={kpiData.total_expected}
          totalPaid={kpiData.total_paid}
          collectionRate={kpiData.collection_rate}
        />
      )}

      <AdvancePaymentsFiltersBar
        year={year}
        month={month}
        status={statusFilter}
        onParamChange={setParam}
      />

      {error && <Alert variant="error" message="שגיאה בטעינת מקדמות" />}

      {!isLoading && (
        <p className="text-sm text-gray-500">{total.toLocaleString('he-IL')} רשומות</p>
      )}

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/clients/${row.client_record_id}/advance-payments`)}
        emptyMessage="אין מקדמות לפי הסינון הנבחר"
      />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="מקדמות"
          onPageChange={(p) => setParam('page', String(p))}
        />
      )}
    </div>
  )
}
