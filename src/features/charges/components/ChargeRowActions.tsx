import { CheckCircle2, Eye, FileText, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import { canCancel, canIssue, canMarkPaid } from "../utils";

interface ChargeRowActionsProps {
  chargeId: number;
  status: string;
  disabled?: boolean;
  showActions?: boolean;
  onIssue: () => void;
  onMarkPaid: () => void;
  onCancel: () => void;
  onOpenDetail: () => void;
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
  const hasActions = showActions && (canIssue(status) || canMarkPaid(status) || canCancel(status));

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות לחיוב ${chargeId}`}>
        <DropdownMenuItem label="צפייה בפרטים" onClick={onOpenDetail} icon={<Eye className="h-4 w-4" />} disabled={disabled} />
        {hasActions && <div className="my-1 border-t border-gray-100" />}
        {showActions && canIssue(status) && (
          <DropdownMenuItem label="הנפקה" onClick={onIssue} icon={<FileText className="h-4 w-4" />} disabled={disabled} />
        )}
        {showActions && canMarkPaid(status) && (
          <DropdownMenuItem label="סימון שולם" onClick={onMarkPaid} icon={<CheckCircle2 className="h-4 w-4" />} disabled={disabled} />
        )}
        {showActions && canCancel(status) && (
          <DropdownMenuItem label="ביטול" onClick={onCancel} icon={<Trash2 className="h-4 w-4" />} danger disabled={disabled} />
        )}
      </DropdownMenu>
    </div>
  );
};

ChargeRowActions.displayName = "ChargeRowActions";
