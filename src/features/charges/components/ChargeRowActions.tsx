import { CheckCircle2, Eye, FileText, Trash2 } from 'lucide-react'
import { RowActionItem, RowActionSeparator, RowActionsMenu } from '@/components/ui/table'
import { canCancel, canIssue, canMarkPaid } from '../utils'

interface ChargeRowActionsProps {
  chargeId: number
  status: string
  disabled?: boolean
  showActions?: boolean
  onIssue: () => void
  onMarkPaid: () => void
  onCancel: () => void
  onOpenDetail: () => void
}

export const ChargeRowActions: React.FC<ChargeRowActionsProps> = ({
  chargeId,
  status,
  disabled = false,
  showActions = true,
  onIssue,
  onMarkPaid,
  onCancel,
  onOpenDetail,
}) => {
  const hasActions = showActions && (canIssue(status) || canMarkPaid(status) || canCancel(status))

  return (
    <RowActionsMenu ariaLabel={`פעולות לחיוב ${chargeId}`}>
      <RowActionItem
        label="צפייה בפרטים"
        onClick={onOpenDetail}
        icon={<Eye className="h-4 w-4" />}
        disabled={disabled}
      />
      {hasActions && <RowActionSeparator />}
      {showActions && canIssue(status) && (
        <RowActionItem
          label="הנפקה"
          onClick={onIssue}
          icon={<FileText className="h-4 w-4" />}
          disabled={disabled}
        />
      )}
      {showActions && canMarkPaid(status) && (
        <RowActionItem
          label="סימון שולם"
          onClick={onMarkPaid}
          icon={<CheckCircle2 className="h-4 w-4" />}
          disabled={disabled}
        />
      )}
      {showActions && canCancel(status) && (
        <RowActionItem
          label="ביטול"
          onClick={onCancel}
          icon={<Trash2 className="h-4 w-4" />}
          danger
          disabled={disabled}
        />
      )}
    </RowActionsMenu>
  )
}

ChargeRowActions.displayName = 'ChargeRowActions'
