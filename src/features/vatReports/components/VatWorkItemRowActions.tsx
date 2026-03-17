import { PackageCheck, SendHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { canMarkMaterialsComplete, canMarkReadyForReview, isFiled } from "../utils";
import type { VatWorkItemAction } from "../hooks/useVatWorkItemsPage";

interface VatWorkItemRowActionsProps {
  item: VatWorkItemResponse;
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}

export const VatWorkItemRowActions: React.FC<VatWorkItemRowActionsProps> = ({
  item,
  isLoading,
  isDisabled,
  runAction,
}) => {
  const hasAny =
    canMarkMaterialsComplete(item.status) ||
    canMarkReadyForReview(item.status);

  if (isFiled(item.status)) {
    return <span className="text-xs text-gray-400">הוגש</span>;
  }

  if (!hasAny) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות לפריט ${item.id}`}>
        {canMarkMaterialsComplete(item.status) && (
          <DropdownMenuItem
            label="אישור קבלה"
            onClick={() => void runAction(item.id, "materialsComplete")}
            icon={<PackageCheck className="h-4 w-4" />}
            disabled={isLoading || isDisabled}
          />
        )}
        {canMarkReadyForReview(item.status) && (
          <DropdownMenuItem
            label="שלח לבדיקה"
            onClick={() => void runAction(item.id, "readyForReview")}
            icon={<SendHorizontal className="h-4 w-4" />}
            disabled={isLoading || isDisabled}
          />
        )}

      </DropdownMenu>
    </div>
  );
};

VatWorkItemRowActions.displayName = "VatWorkItemRowActions";
