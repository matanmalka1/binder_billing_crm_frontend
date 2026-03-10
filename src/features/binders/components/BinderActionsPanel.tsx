import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { BinderResponse } from "../types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import { mapActions } from "../../../lib/actions/mapActions";

interface BinderActionsPanelProps {
  binder: BinderResponse;
  activeActionKeyRef: React.RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const BinderActionsPanel: React.FC<BinderActionsPanelProps> = ({
  binder,
  activeActionKeyRef,
  onAction,
  onDelete,
  isDeleting,
}) => {
  const actions = mapActions(binder.available_actions as BackendAction[] | null | undefined);
  const action = actions[0] ?? null;

  const actionButton = (() => {
    if (binder.status === "ready_for_pickup" && action) {
      return (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onAction(action)}
          isLoading={activeActionKeyRef.current === action.uiKey}
          disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
        >
          החזרת קלסר
        </Button>
      );
    }
    if (binder.status === "in_office" && binder.work_state === "in_progress" && action) {
      return (
        <Button
          type="button"
          size="sm"
          onClick={() => onAction(action)}
          isLoading={activeActionKeyRef.current === action.uiKey}
          disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
          className="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm"
        >
          סיום טיפול
        </Button>
      );
    }
    return null;
  })();

  if (!actionButton && !onDelete) {
    return null;
  }

  return (
    <div className="pt-2 flex items-center gap-2">
      {actionButton}
      {onDelete && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          isLoading={isDeleting}
          disabled={isDeleting}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          מחק קלסר
        </Button>
      )}
    </div>
  );
};

BinderActionsPanel.displayName = "BinderActionsPanel";
