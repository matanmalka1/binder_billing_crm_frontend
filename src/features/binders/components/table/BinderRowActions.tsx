import { ArrowLeft, CheckCircle2, Eye, RotateCcw, Trash2, CalendarCheck, PackageCheck } from "lucide-react";
import { RowActionItem, RowActionSeparator, RowActionsMenu } from "@/components/ui/table";
import { canMarkReady, canReturn, canRevertReady } from "../../utils";
import type { BinderResponse } from "../../types";

interface BinderRowActionsProps {
  binder: BinderResponse;
  disabled?: boolean;
  onOpenDetail: () => void;
  onMarkReady: () => void;
  onRevertReady: () => void;
  onReturn: () => void;
  onDelete: () => void;
  onBulkReady?: () => void;
  onHandover?: () => void;
}

export const BinderRowActions: React.FC<BinderRowActionsProps> = ({
  binder,
  disabled = false,
  onOpenDetail,
  onMarkReady,
  onRevertReady,
  onReturn,
  onDelete,
  onBulkReady,
  onHandover,
}) => {
  const { status } = binder;
  const hasActions = canMarkReady(status) || canRevertReady(status) || canReturn(status);
  const showBulkReady = (status === "in_office" || status === "closed_in_office") && onBulkReady;
  const showHandover = status === "ready_for_pickup" && onHandover;

  return (
    <RowActionsMenu ariaLabel={`פעולות לקלסר ${binder.id}`}>
        <RowActionItem label="צפייה בפרטים" onClick={onOpenDetail} icon={<Eye className="h-4 w-4" />} disabled={disabled} />
        {hasActions && <RowActionSeparator />}
        {canMarkReady(status) && (
          <RowActionItem label="מוכן לאיסוף" onClick={onMarkReady} icon={<CheckCircle2 className="h-4 w-4" />} disabled={disabled} />
        )}
        {showBulkReady && (
          <RowActionItem label="מוכן עד תקופה" onClick={onBulkReady} icon={<CalendarCheck className="h-4 w-4" />} disabled={disabled} />
        )}
        {canRevertReady(status) && (
          <RowActionItem label="בטל מוכן לאיסוף" onClick={onRevertReady} icon={<RotateCcw className="h-4 w-4" />} disabled={disabled} />
        )}
        {canReturn(status) && (
          <RowActionItem label="החזרה" onClick={onReturn} icon={<ArrowLeft className="h-4 w-4" />} disabled={disabled} />
        )}
        {showHandover && (
          <RowActionItem label="מסירת כמה קלסרים" onClick={onHandover} icon={<PackageCheck className="h-4 w-4" />} disabled={disabled} />
        )}
        <RowActionSeparator />
        <RowActionItem label="מחק קלסר" onClick={onDelete} icon={<Trash2 className="h-4 w-4" />} danger disabled={disabled} />
      </RowActionsMenu>
  );
};

BinderRowActions.displayName = "BinderRowActions";
