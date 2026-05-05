import { makeClassGetter } from '@/utils/labels'
import { parseISO, differenceInCalendarDays } from 'date-fns'
export { getDeadlineTypeLabel } from '@/utils/enums'

const urgencyColors = {
  normal: 'bg-positive-100 text-positive-800 border-positive-200',
  warning: 'bg-warning-100 text-warning-800 border-warning-200',
  critical: 'bg-negative-100 text-negative-800 border-negative-200',
  overdue: 'bg-negative-600 text-white border-negative-700',
  none: 'bg-gray-100 text-gray-800 border-gray-200',
}

export const getUrgencyColor = makeClassGetter(urgencyColors, undefined, 'bg-gray-100 text-gray-800 border-gray-200')

export const formatCurrency = (amount: string | number | null): string => {
  if (amount === null) return '—'
  const numeric = Number(amount)
  if (Number.isNaN(numeric)) return '—'
  return `${numeric.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`
}

export const calculateDaysRemaining = (dueDate: string): number => {
  const due = parseISO(dueDate)
  return differenceInCalendarDays(due, new Date())
}
