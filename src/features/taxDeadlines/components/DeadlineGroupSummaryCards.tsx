import { useMemo } from 'react'
import { AlertTriangle, CalendarClock, Users, Wallet } from 'lucide-react'
import { StatsCard } from '@/components/ui/layout/StatsCard'
import { formatCurrency } from '../api'
import type { DeadlineGroup } from '../api'

interface DeadlineGroupSummaryCardsProps {
  groups: DeadlineGroup[]
}

export const DeadlineGroupSummaryCards = ({ groups }: DeadlineGroupSummaryCardsProps) => {
  const summary = useMemo(() => {
    let openGroups = 0
    let totalClients = 0
    let overdueGroups = 0
    let openAmount = 0

    for (const g of groups) {
      if (g.pending_count > 0) openGroups++
      totalClients += g.pending_count
      if (g.overdue_count > 0) overdueGroups++
      if (g.open_amount !== null) openAmount += Number(g.open_amount)
    }

    const totalCompleted = groups.reduce((s, g) => s + g.completed_count, 0)
    const totalAll = groups.reduce((s, g) => s + g.total_clients, 0)
    const pct = totalAll > 0 ? Math.round((totalCompleted / totalAll) * 100) : 0

    return { openGroups, totalClients, overdueGroups, openAmount, pct }
  }, [groups])

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatsCard
        title="מועדים פתוחים"
        value={summary.openGroups}
        icon={CalendarClock}
        variant="blue"
      />
      <StatsCard
        title="לקוחות ממתינים"
        value={summary.totalClients}
        icon={Users}
        variant="orange"
      />
      <StatsCard
        title="מועדים באיחור"
        value={summary.overdueGroups}
        icon={AlertTriangle}
        variant="red"
      />
      <StatsCard
        title="סכום פתוח"
        value={formatCurrency(String(summary.openAmount))}
        icon={Wallet}
        variant="neutral"
      />
    </div>
  )
}

DeadlineGroupSummaryCards.displayName = 'DeadlineGroupSummaryCards'
