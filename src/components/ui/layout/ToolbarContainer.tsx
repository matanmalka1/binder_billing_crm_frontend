import { cn } from '../../../utils/utils'
import { Card } from '../primitives/Card'

interface ToolbarContainerProps {
  children: React.ReactNode
  /** When true, wraps in a Card. When false (default), uses bare border container. */
  elevated?: boolean
  className?: string
}

export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ children, elevated = false, className }) => {
  if (elevated) {
    return (
      <Card className={className}>
        <div>{children}</div>
      </Card>
    )
  }

  return <div className={cn('rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3', className)}>{children}</div>
}

ToolbarContainer.displayName = 'ToolbarContainer'
