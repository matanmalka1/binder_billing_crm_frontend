import { useState } from "react";
import { CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import type { TaxDeadlineResponse } from "../api";

interface TaxDeadlineRowActionsProps {
  deadline: TaxDeadlineResponse;
  completingId: number | null;
  deletingId?: number | null;
  onComplete?: (id: number) => void;
  onEdit?: (deadline: TaxDeadlineResponse) => void;
  onDelete?: (id: number) => void;
}

export const TaxDeadlineRowActions: React.FC<TaxDeadlineRowActionsProps> = ({
  deadline,
  completingId,
  deletingId,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const actionKeys = new Set((deadline.available_actions ?? []).map((action) => action.key));
  const canComplete = Boolean(onComplete) && actionKeys.has("complete");
  const canEdit = Boolean(onEdit) && actionKeys.has("edit");
  const canDelete = Boolean(onDelete) && actionKeys.has("delete");
  const hasMenu = canComplete || canEdit || canDelete;
  if (!hasMenu) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות למועד ${deadline.id}`}>
        {canComplete && (
          <DropdownMenuItem
            label="סמן הושלם"
            onClick={() => onComplete?.(deadline.id)}
            icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
            disabled={completingId !== null}
          />
        )}
        {canEdit && (
          <DropdownMenuItem label="עריכה" onClick={() => onEdit(deadline)} icon={<Edit2 className="h-4 w-4" />} />
        )}
        {canDelete && (
          <>
            {(canComplete || canEdit) && <div className="my-1 border-t border-gray-100" />}
            <DropdownMenuItem
              label="מחק"
              onClick={() => setConfirmDelete(true)}
              icon={<Trash2 className="h-4 w-4" />}
              danger
              disabled={deletingId === deadline.id}
            />
          </>
        )}
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDelete}
        title="מחיקת מועד"
        message="האם למחוק את המועד? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={deletingId === deadline.id}
        onConfirm={() => { setConfirmDelete(false); onDelete?.(deadline.id); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

TaxDeadlineRowActions.displayName = "TaxDeadlineRowActions";
