import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react'
import { StatsCard } from '@/components/ui/layout/StatsCard'
import type { TaxDeadlineResponse } from '../api'
import { getDeadlineSummary } from '../utils'

interface DeadlineSummaryCardsProps {
  deadlines: TaxDeadlineResponse[]
}

export const DeadlineSummaryCards = ({ deadlines }: DeadlineSummaryCardsProps) => {
  const summary = useMemo(() => getDeadlineSummary(deadlines), [deadlines])

  const stats = [
    {
      key: 'pending',
      title: 'ממתינים',
      value: summary.pending,
      icon: RotateCcw,
      variant: 'orange' as const,
    },
    {
      key: 'overdue',
      title: 'באיחור',
      value: summary.overdue,
      icon: AlertTriangle,
      variant: 'red' as const,
    },
    {
      key: 'completed',
      title: 'הושלמו',
      value: summary.completed,
      icon: CheckCircle2,
      variant: 'green' as const,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <StatsCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          className="bg-transparent shadow-none hover:shadow-none"
        />
      ))}
    </div>
  )
}

DeadlineSummaryCards.displayName = 'DeadlineSummaryCards'
