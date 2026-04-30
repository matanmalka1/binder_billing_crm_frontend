import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, ListChecks, RotateCcw } from 'lucide-react'
import { StatsCard } from '@/components/ui/layout/StatsCard'
import { formatCurrency, type TaxDeadlineResponse } from '../api'
import { getDeadlineSummary } from '../utils'

interface DeadlineSummaryCardsProps {
  deadlines: TaxDeadlineResponse[]
}

export const DeadlineSummaryCards = ({ deadlines }: DeadlineSummaryCardsProps) => {
  const summary = useMemo(() => getDeadlineSummary(deadlines), [deadlines])

  const stats = [
    {
      key: 'overdue',
      title: 'באיחור',
      value: summary.overdue,
      icon: AlertTriangle,
      variant: 'red' as const,
    },
    {
      key: 'pending',
      title: 'ממתינים',
      value: summary.pending,
      icon: RotateCcw,
      variant: 'orange' as const,
    },
    {
      key: 'completed',
      title: 'הושלמו',
      value: summary.completed,
      icon: CheckCircle2,
      variant: 'green' as const,
    },
    {
      key: 'totalOpen',
      title: 'סכום פתוח',
      value: formatCurrency(String(summary.totalOpen)),
      icon: ListChecks,
      variant: 'neutral' as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  )
}

DeadlineSummaryCards.displayName = 'DeadlineSummaryCards'
