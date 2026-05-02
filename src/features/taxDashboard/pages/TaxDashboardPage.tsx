import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, FileSpreadsheet } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageStateGuard } from '@/components/ui/layout/PageStateGuard'
import { DataTable, type Column } from '@/components/ui/table/DataTable'
import { Badge } from '@/components/ui/primitives/Badge'
import { TaxSubmissionStats, useTaxDashboard } from '@/features/taxDashboard'
import {
  getDeadlineDaysLabelShort,
  getTaxDeadlinePeriodLabel,
  type DeadlineUrgentItem,
  type TaxDeadlineResponse,
} from '@/features/taxDeadlines'
import { formatDate } from '@/utils/utils'

const urgencyVariant = (urgency: string) => {
  if (urgency === 'overdue' || urgency === 'critical') return 'error' as const
  if (urgency === 'warning') return 'warning' as const
  return 'neutral' as const
}

const deadlineTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    vat: 'מע"מ',
    vat_filing: 'מע"מ',
    annual_report: 'דוח שנתי',
    advance_payment: 'מקדמה',
    income_tax: 'מס הכנסה',
    national_insurance: 'ביטוח לאומי',
    withholding: 'ניכויים',
  }
  return labels[type] ?? type
}

const urgentColumns: Column<DeadlineUrgentItem>[] = [
  {
    key: 'client',
    header: 'לקוח',
    render: (item) => <span className="font-semibold text-gray-900">{item.client_name}</span>,
  },
  {
    key: 'type',
    header: 'סוג',
    render: (item) => deadlineTypeLabel(item.deadline_type),
  },
  {
    key: 'due_date',
    header: 'מועד',
    render: (item) => formatDate(item.due_date),
  },
  {
    key: 'urgency',
    header: 'דחיפות',
    render: (item) => (
      <Badge variant={urgencyVariant(item.urgency_level)}>
        {getDeadlineDaysLabelShort(item.days_remaining, false)}
      </Badge>
    ),
  },
]

const upcomingColumns: Column<TaxDeadlineResponse>[] = [
  {
    key: 'client',
    header: 'לקוח',
    render: (item) => <span className="font-semibold text-gray-900">{item.client_name}</span>,
  },
  {
    key: 'type',
    header: 'סוג',
    render: (item) => deadlineTypeLabel(item.deadline_type),
  },
  {
    key: 'period',
    header: 'תקופה',
    render: (item) => getTaxDeadlinePeriodLabel(item),
  },
  {
    key: 'due_date',
    header: 'מועד',
    render: (item) => formatDate(item.due_date),
  },
  {
    key: 'status',
    header: 'סטטוס',
    render: (item) => <Badge variant={urgencyVariant(item.urgency_level)}>{item.status}</Badge>,
  },
]

export const TaxDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('')
  const { currentYear, submissions, urgentDeadlines, upcomingDeadlines, isLoading, hasError } =
    useTaxDashboard()

  const header = (
    <PageHeader
      title="לוח מסים"
      description={`סקירת הגשות ומועדים לשנת ${currentYear}`}
    />
  )

  const filteredUpcoming = useMemo(() => {
    if (!activeFilter) return upcomingDeadlines
    return upcomingDeadlines.filter((deadline) => deadline.status === activeFilter)
  }, [activeFilter, upcomingDeadlines])

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={hasError ? 'שגיאה בטעינת לוח המסים' : null}
      header={header}
      loadingMessage="טוען לוח מסים..."
    >
      <TaxSubmissionStats
        data={submissions}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      <DataTable
        data={urgentDeadlines}
        columns={urgentColumns}
        getRowKey={(item) => item.id}
        onRowClick={(item) => navigate(`/clients/${item.client_record_id}/deadlines`)}
        emptyMessage="אין מועדים דחופים"
        emptyState={{
          icon: CalendarDays,
          title: 'אין מועדים דחופים',
          message: 'לא נמצאו מועדים דחופים לטיפול.',
        }}
      />

      <DataTable
        data={filteredUpcoming}
        columns={upcomingColumns}
        getRowKey={(item) => item.id}
        onRowClick={(item) => navigate(`/clients/${item.client_record_id}/deadlines`)}
        emptyMessage="אין מועדים קרובים"
        emptyState={{
          icon: FileSpreadsheet,
          title: 'אין מועדים קרובים',
          message: 'לא נמצאו מועדים קרובים לפי הסינון הנוכחי.',
        }}
      />
    </PageStateGuard>
  )
}
