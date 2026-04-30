import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, Inbox } from 'lucide-react'
import { cn } from '@/utils/utils'

type Tone = 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple'

const toneClasses: Record<
  Tone,
  {
    icon: string
    badge: string
    border: string
    bar: string
  }
> = {
  neutral: {
    icon: 'bg-slate-100 text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200',
    bar: 'bg-slate-500',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    badge: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
    bar: 'bg-blue-500',
  },
  green: {
    icon: 'bg-green-50 text-green-600',
    badge: 'bg-green-50 text-green-700',
    border: 'border-green-200',
    bar: 'bg-green-500',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
  },
  red: {
    icon: 'bg-red-50 text-red-600',
    badge: 'bg-red-50 text-red-700',
    border: 'border-red-200',
    bar: 'bg-red-500',
  },
  purple: {
    icon: 'bg-slate-100 text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200',
    bar: 'bg-slate-500',
  },
}

interface DashboardSurfaceProps {
  children: ReactNode
  className?: string
}

export const DashboardSurface = ({ children, className }: DashboardSurfaceProps) => (
  <div dir="rtl" className={cn('space-y-5', className)}>
    {children}
  </div>
)

interface DashboardSectionHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  count?: number | string
  action?: ReactNode
  tone?: Tone
  className?: string
}

export const DashboardSectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  count,
  action,
  tone = 'neutral',
  className,
}: DashboardSectionHeaderProps) => (
  <div className={cn('flex items-center justify-between gap-4', className)}>
    <div className="flex min-w-0 items-center gap-3">
      {Icon && (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            toneClasses[tone].icon,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="truncate text-sm font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      {count !== undefined && (
        <span
          className={cn(
            'inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums',
            toneClasses[tone].badge,
          )}
        >
          {count}
        </span>
      )}
      {action}
    </div>
  </div>
)

interface DashboardPanelProps {
  children: ReactNode
  className?: string
}

export const DashboardPanel = ({ children, className }: DashboardPanelProps) => (
  <section
    className={cn(
      'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
      className,
    )}
  >
    {children}
  </section>
)

interface DashboardMetricCardProps {
  title: string
  value: string | number
  description: string
  eyebrow?: string
  icon: LucideIcon
  tone: Tone
  urgent?: boolean
  progress?: number
  actionLabel?: string
  className?: string
}

export const DashboardMetricCard = ({
  title,
  value,
  description,
  eyebrow,
  icon: Icon,
  tone,
  urgent,
  progress,
  actionLabel,
  className,
}: DashboardMetricCardProps) => (
  <div
    className={cn(
      'flex h-full flex-col rounded-xl border bg-white p-3 text-right shadow-sm transition-all duration-200',
      'group-hover:-translate-y-0.5 group-hover:shadow-md',
      urgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200',
      className,
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-0.5 truncate text-[10px] font-semibold text-gray-400">{eyebrow}</p>
        )}
        <h3 className="truncate text-xs font-bold text-gray-800">{title}</h3>
      </div>
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          toneClasses[urgent ? 'red' : tone].icon,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold tabular-nums text-gray-950">{value}</p>
      <p className="mt-0.5 line-clamp-2 min-h-7 text-[11px] leading-3.5 text-gray-500">
        {description}
      </p>
    </div>
    {progress !== undefined && (
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn('h-full rounded-full', toneClasses[urgent ? 'red' : tone].bar)}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    )}
    <div className="mt-auto pt-2">
      {actionLabel && (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-semibold',
            urgent ? 'text-red-700' : 'text-slate-600',
          )}
        >
          {actionLabel}
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  </div>
)

interface DashboardBadgeProps {
  children: ReactNode
  tone?: Tone
  strong?: boolean
  className?: string
}

export const DashboardBadge = ({
  children,
  tone = 'neutral',
  strong,
  className,
}: DashboardBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
      toneClasses[tone].badge,
      strong && toneClasses[tone].border,
      strong && 'border',
      className,
    )}
  >
    {children}
  </span>
)

interface DashboardEmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export const DashboardEmptyState = ({
  title,
  description,
  icon: Icon = Inbox,
  className,
}: DashboardEmptyStateProps) => (
  <div
    className={cn('flex flex-col items-center justify-center gap-2 py-10 text-center', className)}
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
      <Icon className="h-5 w-5" />
    </span>
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    {description && <p className="text-xs text-gray-400">{description}</p>}
  </div>
)
