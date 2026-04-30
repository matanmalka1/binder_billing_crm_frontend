import { cn } from '../../../utils/utils'

interface SectionHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  /**
   * xs  — DrawerSection label (uppercase, tracking-wide)
   * sm  — Card header
   * lg  — PageHeader (h1, bold)
   */
  size?: 'xs' | 'sm' | 'lg'
  border?: 'bottom' | 'none'
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  size = 'sm',
  border = 'none',
  className,
}) => (
  <div
    className={cn(
      'flex items-start justify-between gap-4',
      border === 'bottom' && 'border-b border-gray-100/80 pb-3',
      className,
    )}
  >
    <div>
      {size === 'lg' ? (
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">{title}</h1>
      ) : size === 'xs' ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      ) : (
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
      )}
      {subtitle && (
        <p
          className={cn(
            'text-gray-600',
            size === 'lg' ? 'mt-3' : 'mt-1',
            size === 'lg' ? 'text-base md:text-lg max-w-3xl leading-relaxed' : 'text-sm',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
)

SectionHeader.displayName = 'SectionHeader'
