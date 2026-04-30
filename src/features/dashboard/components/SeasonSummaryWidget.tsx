import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/utils'
import { semanticMonoToneClasses } from '@/utils/semanticColors'
import { useSeasonSummary } from '../hooks/useSeasonSummary'
import { DashboardBadge, DashboardPanel } from './DashboardPrimitives'

export const SeasonSummaryWidget: React.FC = () => {
  const { stats, isPending } = useSeasonSummary()

  if (isPending) {
    return <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
  }

  if (!stats || stats.total === 0) {
    return (
      <DashboardPanel>
        <Link to="/tax/reports" className="group block p-5 transition-colors hover:bg-slate-50/70">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-400">עונת הגשה</p>
              <h3 className="mt-1 text-lg font-bold text-gray-950">אין דוחות פעילים</h3>
            </div>

            <DashboardBadge tone="neutral">
              <TrendingUp className="ml-1 h-3.5 w-3.5" />
              0%
            </DashboardBadge>
          </div>
        </Link>
      </DashboardPanel>
    )
  }

  return (
    <DashboardPanel>
      <Link to="/tax/reports" className="group block p-5 transition-colors hover:bg-slate-50/70">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-400">
              עונת הגשה {stats.currentYear}
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-950">
              {stats.done} / {stats.total} דוחות הוגשו
            </h3>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {stats.hasOverdue ? (
              <DashboardBadge tone="red" strong>
                <AlertTriangle className="ml-1 h-3.5 w-3.5" />
                {stats.overdueCount} באיחור
              </DashboardBadge>
            ) : (
              stats.done > 0 && (
                <DashboardBadge tone="green">
                  <CheckCircle className="ml-1 h-3.5 w-3.5" />
                  ללא איחורים
                </DashboardBadge>
              )
            )}

            <DashboardBadge tone="neutral">
              <TrendingUp className="ml-1 h-3.5 w-3.5" />
              {stats.completionPct}%
            </DashboardBadge>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn('h-2 rounded-full transition-all duration-700', stats.progressColor)}
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <StatLabel count={stats.notStarted} label="לא התחילו" />
          <StatLabel
            count={stats.inProgress}
            label="בעבודה"
            className={semanticMonoToneClasses.info}
          />
          <StatLabel
            count={stats.submitted}
            label="הוגשו"
            className={semanticMonoToneClasses.positive}
          />
          <StatLabel count={stats.closed} label="סגורים" />
        </div>
      </Link>
    </DashboardPanel>
  )
}

const StatLabel = ({
  count,
  label,
  className,
}: {
  count: number
  label: string
  className?: string
}) => {
  if (count <= 0) return null
  return (
    <span>
      <span className={cn('font-semibold text-gray-700', className)}>{count}</span> {label}
    </span>
  )
}

SeasonSummaryWidget.displayName = 'SeasonSummaryWidget'
