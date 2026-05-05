import { cn } from '../../../utils/utils'

interface SkeletonBlockProps {
  /** Tailwind width class, e.g. "w-24" */
  width?: string
  /** Tailwind height class, e.g. "h-4" */
  height?: string
  rounded?: 'sm' | 'md' | 'full' | 'xl'
  /** Gradient shimmer animation vs plain pulse */
  shimmer?: boolean
  /** Inline animation-delay value, e.g. "0.1s" */
  delay?: string
  className?: string
}

const roundedClass = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  full: 'rounded-full',
  xl: 'rounded-xl',
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = 'w-24',
  height = 'h-4',
  rounded = 'md',
  shimmer = false,
  delay,
  className,
}) => (
  <div
    className={cn(
      'relative overflow-hidden',
      width,
      height,
      roundedClass[rounded],
      shimmer ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer' : 'animate-pulse bg-gray-100',
      className,
    )}
    style={shimmer ? { backgroundSize: '1000px 100%', animationDelay: delay } : { animationDelay: delay }}
  />
)

SkeletonBlock.displayName = 'SkeletonBlock'
