import React from 'react'
import { cn } from '../../../utils/utils'
import { SectionHeader } from '../layout/SectionHeader'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'elevated'
  interactive?: boolean
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  footer,
  variant = 'default',
  interactive = false,
  style,
  ...rest
}) => {
  const variants = {
    default: 'bg-white border border-gray-200/80',
    elevated: 'bg-white border-0 shadow-elevation-2',
  }

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-200',
        variants[variant],
        interactive && 'hover:shadow-elevation-3 hover:-translate-y-0.5 cursor-pointer',
        'animate-fade-in',
        className,
      )}
      style={style}
      {...rest}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-transparent">
          <SectionHeader title={title!} subtitle={subtitle} actions={actions} size="sm" />
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && <div className="px-6 py-4 border-t border-gray-100/80 bg-gray-50/50">{footer}</div>}
    </div>
  )
}
