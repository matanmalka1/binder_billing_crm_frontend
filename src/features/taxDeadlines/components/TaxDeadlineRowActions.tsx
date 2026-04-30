import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Edit2, ExternalLink, RotateCcw, Trash2 } from 'lucide-react'
import { RowActionItem, RowActionSeparator, RowActionsMenu } from '@/components/ui/table'
import { Button } from '@/components/ui/primitives/Button'
import { ConfirmDialog } from '../../../components/ui/overlays/ConfirmDialog'
import type { TaxDeadlineResponse } from '../api'
import { getTaxDeadlineSourcePath } from '../sourcePath'

const SOURCE_LINK_LABELS: Record<string, string> = {
  vat: 'פתח דוח מע״מ',
  advance_payment: 'פתח מקדמות',
  annual_report: 'פתח דוח שנתי',
}

interface TaxDeadlineRowActionsProps {
  deadline: TaxDeadlineResponse
  completingId: number | null
  reopeningId?: number | null
  deletingId?: number | null
  onComplete?: (id: number) => void
  onReopen?: (id: number) => void
  onEdit?: (deadline: TaxDeadlineResponse) => void
  onDelete?: (id: number) => void
  clientScoped?: boolean
}

export const TaxDeadlineRowActions: React.FC<TaxDeadlineRowActionsProps> = ({
  deadline,
  completingId,
  reopeningId,
  deletingId,
  onComplete,
  onReopen,
  onEdit,
  onDelete,
  clientScoped = false,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const navigate = useNavigate()
  const sourcePath = getTaxDeadlineSourcePath(deadline)
  const sourceLabel = SOURCE_LINK_LABELS[deadline.deadline_type] ?? 'פתח מקור'
  const actionKeys = new Set((deadline.available_actions ?? []).map((action) => action.key))
  const canComplete = Boolean(onComplete) && actionKeys.has('complete')
  const canReopen = Boolean(onReopen) && actionKeys.has('reopen')
  const canEdit = Boolean(onEdit) && actionKeys.has('edit')
  const canDelete = Boolean(onDelete) && actionKeys.has('delete')
  const isCompleting = completingId === deadline.id
  const isReopening = reopeningId === deadline.id
  const isDeleting = deletingId === deadline.id
  const isMutating = completingId !== null || reopeningId !== null || deletingId !== null

  if (clientScoped) {
    const hasSecondary = canEdit || canDelete
    return (
      <>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {sourcePath && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(sourcePath)}
              className="gap-1.5 whitespace-nowrap"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {sourceLabel}
            </Button>
          )}
          {canComplete && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={isCompleting}
              loadingLabel="מסמן..."
              disabled={isMutating}
              onClick={() => onComplete?.(deadline.id)}
              className="gap-1.5 whitespace-nowrap"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-positive-600" />
              סמן הושלם
            </Button>
          )}
          {canReopen && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={isReopening}
              loadingLabel="מחזיר..."
              disabled={isMutating}
              onClick={() => onReopen?.(deadline.id)}
              className="gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5 text-warning-600" />
              החזר לממתין
            </Button>
          )}
          {hasSecondary && (
            <RowActionsMenu ariaLabel={`פעולות נוספות למועד ${deadline.id}`}>
              {canEdit && (
                <RowActionItem
                  label="עריכה"
                  onClick={() => onEdit?.(deadline)}
                  icon={<Edit2 className="h-4 w-4" />}
                  disabled={isMutating}
                />
              )}
              {canDelete && (
                <>
                  {canEdit && <RowActionSeparator />}
                  <RowActionItem
                    label={isDeleting ? 'מוחק...' : 'מחק'}
                    onClick={() => setConfirmDelete(true)}
                    icon={<Trash2 className="h-4 w-4" />}
                    danger
                    disabled={isMutating}
                  />
                </>
              )}
            </RowActionsMenu>
          )}
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="מחיקת מועד"
          message="האם למחוק את המועד? פעולה זו אינה הפיכה."
          confirmLabel="מחק"
          cancelLabel="ביטול"
          isLoading={isDeleting}
          onConfirm={() => {
            setConfirmDelete(false)
            onDelete?.(deadline.id)
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      </>
    )
  }

  const hasMenu = canComplete || canReopen || canEdit || canDelete || sourcePath !== null
  if (!hasMenu) return null

  return (
    <>
      <RowActionsMenu ariaLabel={`פעולות למועד ${deadline.id}`}>
        {sourcePath && (
          <>
            <RowActionItem
              label={sourceLabel}
              onClick={() => navigate(sourcePath)}
              icon={<ExternalLink className="h-4 w-4 text-primary-600" />}
            />
            {(canComplete || canReopen || canEdit || canDelete) && <RowActionSeparator />}
          </>
        )}
        {canComplete && (
          <RowActionItem
            label={isCompleting ? 'מסמן...' : 'סמן הושלם'}
            onClick={() => onComplete?.(deadline.id)}
            icon={<CheckCircle2 className="h-4 w-4 text-positive-600" />}
            disabled={isMutating}
          />
        )}
        {canReopen && (
          <RowActionItem
            label={isReopening ? 'מחזיר...' : 'החזר לממתין'}
            onClick={() => onReopen?.(deadline.id)}
            icon={<RotateCcw className="h-4 w-4 text-warning-600" />}
            disabled={isMutating}
          />
        )}
        {canEdit && (
          <RowActionItem
            label="עריכה"
            onClick={() => onEdit?.(deadline)}
            icon={<Edit2 className="h-4 w-4" />}
            disabled={isMutating}
          />
        )}
        {canDelete && (
          <>
            {(canComplete || canReopen || canEdit) && <RowActionSeparator />}
            <RowActionItem
              label={isDeleting ? 'מוחק...' : 'מחק'}
              onClick={() => setConfirmDelete(true)}
              icon={<Trash2 className="h-4 w-4" />}
              danger
              disabled={isMutating}
            />
          </>
        )}
      </RowActionsMenu>

      <ConfirmDialog
        open={confirmDelete}
        title="מחיקת מועד"
        message="האם למחוק את המועד? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={() => {
          setConfirmDelete(false)
          onDelete?.(deadline.id)
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}

TaxDeadlineRowActions.displayName = 'TaxDeadlineRowActions'
