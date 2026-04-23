import { ArrowLeft, CheckCircle2, Eye, RotateCcw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/overlays/DropdownMenu";
import { canMarkReady, canReturn, canRevertReady } from "../../utils";

interface BinderRowActionsProps {
  binderId: number;
  status: string;
  disabled?: boolean;
  onOpenDetail: () => void;
  onMarkReady: () => void;
  onRevertReady: () => void;
  onReturn: () => void;
  onDelete: () => void;
}

export const BinderRowActions: React.FC<BinderRowActionsProps> = ({
  binderId,
  status,
  disabled = false,
  onOpenDetail,
  onMarkReady,
  onRevertReady,
  onReturn,
  onDelete,
}) => {
  const hasActions = canMarkReady(status) || canRevertReady(status) || canReturn(status);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות לקלסר ${binderId}`}>
        <DropdownMenuItem label="צפייה בפרטים" onClick={onOpenDetail} icon={<Eye className="h-4 w-4" />} disabled={disabled} />
        {hasActions && <div className="my-1 border-t border-gray-100" />}
        {canMarkReady(status) && (
          <DropdownMenuItem label="מוכן לאיסוף" onClick={onMarkReady} icon={<CheckCircle2 className="h-4 w-4" />} disabled={disabled} />
        )}
        {canRevertReady(status) && (
          <DropdownMenuItem label="בטל מוכן לאיסוף" onClick={onRevertReady} icon={<RotateCcw className="h-4 w-4" />} disabled={disabled} />
        )}
        {canReturn(status) && (
          <DropdownMenuItem label="החזרה" onClick={onReturn} icon={<ArrowLeft className="h-4 w-4" />} disabled={disabled} />
        )}
        <div className="my-1 border-t border-gray-100" />
        <DropdownMenuItem label="מחק קלסר" onClick={onDelete} icon={<Trash2 className="h-4 w-4" />} danger disabled={disabled} />
      </DropdownMenu>
    </div>
  );
};

BinderRowActions.displayName = "BinderRowActions";
