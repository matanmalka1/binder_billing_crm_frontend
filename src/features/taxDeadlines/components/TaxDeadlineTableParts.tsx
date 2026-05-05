import { Calendar } from 'lucide-react'
import { Badge } from '../../../components/ui/primitives/Badge'
import { IconLabel } from '../../../components/ui/primitives/IconLabel'
import { formatCurrency } from '../api'
import { formatDate } from '../../../utils/utils'

export const DeadlineStatusBadge = ({ status }: { status: string }) => {
  if (status === 'completed') return <Badge variant="success">הושלם</Badge>
  if (status === 'canceled') return <Badge variant="neutral">בוטל</Badge>
  return <Badge variant="warning">ממתין</Badge>
}

export const DeadlineDateCell = ({ dueDate }: { dueDate: string }) => (
  <IconLabel
    icon={<Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
    label={formatDate(dueDate)}
    className="border-transparent bg-transparent px-0 text-sm font-medium text-gray-700"
  />
)

export const DeadlineAmountCell = ({ amount, status }: { amount: string | null; status: string }) => {
  if (amount === null && status === 'pending') {
    return (
      <span className="text-sm italic text-gray-400" title="הסכום יעודכן לאחר הגשת הדוח">
        סכום לא מחושב
      </span>
    )
  }
  return <span className="text-sm font-medium text-gray-700">{formatCurrency(amount)}</span>
}
