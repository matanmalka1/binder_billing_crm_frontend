import React from 'react'
import { cn } from '../../../utils/utils'
import { semanticBadgeClasses, semanticSignalBadgeClasses } from '@/utils/semanticColors'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  /** Dot color class for signal-style badges (e.g. "bg-negative-500") */
  dot?: string
  /** Adds ring-1 for signal-style appearance */
  ring?: boolean
  /** Shows × remove button (active-filter pill mode) */
  removable?: boolean
  onRemove?: () => void
  onClick?: React.MouseEventHandler<HTMLSpanElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement>
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: semanticBadgeClasses.positive,
  warning: semanticBadgeClasses.warning,
  error: semanticBadgeClasses.negative,
  info: semanticBadgeClasses.info,
  neutral: semanticBadgeClasses.neutral,
}

const signalVariantClasses: Record<BadgeVariant, string> = {
  warning: semanticSignalBadgeClasses.warning,
  info: semanticSignalBadgeClasses.info,
  neutral: semanticSignalBadgeClasses.neutral,
  success: semanticSignalBadgeClasses.positive,
  error: semanticSignalBadgeClasses.negative,
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  dot,
  ring,
  removable,
  onRemove,
  onClick,
  onKeyDown,
  className,
}) => {
  if (removable) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 py-0.5 pe-2.5 ps-1.5 text-xs font-medium text-primary-800',
          className,
        )}
      >
        {children}
        <button
          type="button"
          onClick={onRemove}
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-200 transition-colors"
          aria-label={`הסר סינון`}
        >
          ×
        </button>
      </span>
    )
  }

  if (dot !== undefined || ring) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium',
          signalVariantClasses[variant],
          className,
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dot ?? 'bg-gray-400')} />
        {children}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        onClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className,
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'
