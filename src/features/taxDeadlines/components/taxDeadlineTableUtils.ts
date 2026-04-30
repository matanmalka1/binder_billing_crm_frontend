import type { DeadlineUrgencyLevel } from '../api'
import { cn } from '../../../utils/utils'

interface DeadlineDisplayFields {
  status: string
  urgency_level: DeadlineUrgencyLevel
}

export const getDeadlineRowClassName = (deadline: DeadlineDisplayFields) => {
  return cn(
    deadline.status === 'canceled' && 'opacity-50',
    deadline.urgency_level === 'overdue' && 'border-r-4 border-negative-500 bg-negative-50/50',
    deadline.urgency_level === 'critical' && 'border-r-4 border-negative-400 bg-negative-50/35',
    deadline.urgency_level === 'warning' && 'border-r-4 border-warning-400 bg-warning-50/35',
  )
}
