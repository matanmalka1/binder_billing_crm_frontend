import { PackageCheck, SendHorizontal } from 'lucide-react'
import { RowActionItem, RowActionsMenu } from '@/components/ui/table'
import { canMarkMaterialsComplete, canMarkReadyForReview, isFiled } from '../utils'
import type { VatWorkItemRowActionsProps } from '../types'

export const VatWorkItemRowActions: React.FC<VatWorkItemRowActionsProps> = ({
  item,
  isLoading,
  isDisabled,
  runAction,
}) => {
  const hasAny = canMarkMaterialsComplete(item.status) || canMarkReadyForReview(item.status)

  if (isFiled(item.status)) {
    return <span className="text-xs text-gray-400">הוגש</span>
  }

  if (!hasAny) return null

  return (
    <RowActionsMenu ariaLabel={`פעולות לפריט ${item.id}`}>
      {canMarkMaterialsComplete(item.status) && (
        <RowActionItem
          label="אישור קבלה"
          onClick={() => void runAction(item.id, 'materialsComplete')}
          icon={<PackageCheck className="h-4 w-4" />}
          disabled={isLoading || isDisabled}
        />
      )}
      {canMarkReadyForReview(item.status) && (
        <RowActionItem
          label="שלח לבדיקה"
          onClick={() => void runAction(item.id, 'readyForReview')}
          icon={<SendHorizontal className="h-4 w-4" />}
          disabled={isLoading || isDisabled}
        />
      )}
    </RowActionsMenu>
  )
}

VatWorkItemRowActions.displayName = 'VatWorkItemRowActions'
