import { AlertTriangle, Clock, Calendar } from 'lucide-react'
import { StatsCard } from '@/components/ui/layout/StatsCard'
import type { UnifiedItem } from '../api/contracts'
import type { TaskUrgency } from '../api/contracts'

interface TasksSummaryCardsProps {
  items: UnifiedItem[]
  urgencyFilter: TaskUrgency | null
  onFilter: (urgency: TaskUrgency | null) => void
}

export const TasksSummaryCards: React.FC<TasksSummaryCardsProps> = ({
  items,
  urgencyFilter,
  onFilter,
}) => {
  const overdue = items.filter((i) => i.urgency === 'overdue').length
  const approaching = items.filter((i) => i.urgency === 'approaching').length
  const upcoming = items.filter((i) => i.urgency === 'upcoming').length

  const stats = [
    {
      icon: AlertTriangle,
      variant: 'red' as const,
      count: overdue,
      label: 'באיחור',
      value: 'overdue' as TaskUrgency,
    },
    {
      icon: Clock,
      variant: 'orange' as const,
      count: approaching,
      label: 'מתקרב (עד 7 ימים)',
      value: 'approaching' as TaskUrgency,
    },
    {
      icon: Calendar,
      variant: 'blue' as const,
      count: upcoming,
      label: 'קרוב (8–14 ימים)',
      value: 'upcoming' as TaskUrgency,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map(({ icon, variant, count, label, value }) => (
        <StatsCard
          key={value}
          title={label}
          value={count}
          icon={icon}
          variant={variant}
          selected={urgencyFilter === value}
          onClick={() => onFilter(urgencyFilter === value ? null : value)}
          className="h-full w-full"
        />
      ))}
    </div>
  )
}
