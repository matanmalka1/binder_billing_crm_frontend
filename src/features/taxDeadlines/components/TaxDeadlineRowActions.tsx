import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Edit2, ExternalLink, RotateCcw, Trash2 } from "lucide-react";
import { RowActionItem, RowActionSeparator, RowActionsMenu } from "@/components/ui/table";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import type { TaxDeadlineResponse } from "../api";

const SOURCE_LINK_LABELS: Record<string, string> = {
  vat: 'פתח דוח מע״מ',
  advance_payment: "פתח מקדמות",
  annual_report: "פתח דוח שנתי",
};

const getSourcePath = (deadline: TaxDeadlineResponse): string | null => {
  const id = deadline.client_record_id;
  if (!id) return null;
  if (deadline.deadline_type === "vat") return `/clients/${id}/vat`;
  if (deadline.deadline_type === "advance_payment") return `/clients/${id}/advance-payments`;
  if (deadline.deadline_type === "annual_report") return `/clients/${id}/annual-reports`;
  return null;
};

interface TaxDeadlineRowActionsProps {
  deadline: TaxDeadlineResponse;
  completingId: number | null;
  reopeningId?: number | null;
  deletingId?: number | null;
  onComplete?: (id: number) => void;
  onReopen?: (id: number) => void;
  onEdit?: (deadline: TaxDeadlineResponse) => void;
  onDelete?: (id: number) => void;
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
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const sourcePath = getSourcePath(deadline);
  const sourceLabel = SOURCE_LINK_LABELS[deadline.deadline_type] ?? "פתח מקור";
  const actionKeys = new Set((deadline.available_actions ?? []).map((action) => action.key));
  const canComplete = Boolean(onComplete) && actionKeys.has("complete");
  const canReopen = Boolean(onReopen) && actionKeys.has("reopen");
  const canEdit = Boolean(onEdit) && actionKeys.has("edit");
  const canDelete = Boolean(onDelete) && actionKeys.has("delete");
  const hasMenu = canComplete || canReopen || canEdit || canDelete || sourcePath !== null;
  const isCompleting = completingId === deadline.id;
  const isReopening = reopeningId === deadline.id;
  const isDeleting = deletingId === deadline.id;
  const isMutating = completingId !== null || reopeningId !== null || deletingId !== null;
  if (!hasMenu) return null;

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
            label={isCompleting ? "מסמן..." : "סמן הושלם"}
            onClick={() => onComplete?.(deadline.id)}
            icon={<CheckCircle2 className="h-4 w-4 text-positive-600" />}
            disabled={isMutating}
          />
        )}
        {canReopen && (
          <RowActionItem
            label={isReopening ? "מחזיר..." : "החזר לממתין"}
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
              label={isDeleting ? "מוחק..." : "מחק"}
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
        onConfirm={() => { setConfirmDelete(false); onDelete?.(deadline.id); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

TaxDeadlineRowActions.displayName = "TaxDeadlineRowActions";
