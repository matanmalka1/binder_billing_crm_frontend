import type { NotificationSeverity } from '../api'
import { cn } from '../../../utils/utils'
import type { SeverityBadgeProps } from '../types'

const SEVERITY_LABELS: Record<NotificationSeverity, string> = {
  info: 'מידע',
  warning: 'אזהרה',
  urgent: 'דחוף',
  critical: 'קריטי',
}

const SEVERITY_STYLES: Record<NotificationSeverity, string> = {
  info: 'bg-info-100 text-info-800',
  warning: 'bg-warning-100 text-warning-800',
  urgent: 'bg-orange-100 text-orange-800',
  critical: 'bg-negative-100 text-negative-800',
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => (
  <span
    className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      SEVERITY_STYLES[severity],
    )}
  >
    {SEVERITY_LABELS[severity]}
  </span>
)
SeverityBadge.displayName = 'SeverityBadge'
