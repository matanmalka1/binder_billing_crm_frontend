import { cn } from '../../../utils/utils'

interface TruncateTextProps {
  text: string
  /** Tailwind max-width class, e.g. "max-w-md". Defaults to "max-w-xs". */
  maxWidth?: string
  className?: string
}

export const TruncateText: React.FC<TruncateTextProps> = ({ text, maxWidth = 'max-w-xs', className }) => (
  <span className={cn('block truncate text-sm', maxWidth, className)} title={text}>
    {text}
  </span>
)

TruncateText.displayName = 'TruncateText'
