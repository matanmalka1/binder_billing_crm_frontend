import { Button } from "./Button";
import { mapActions } from "../../lib/actions/mapActions";
import type { Column } from "./DataTable";
import type { ActionCommand } from "../../lib/actions/types";
import { cn } from "../../utils/utils";

type ActionsColumnParams<T> = {
  header?: string;
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
  getActions: (row: T) => ActionCommand[] | undefined;
};

export const buildActionsColumn = <T,>({
  header = "פעולות",
  activeActionKey,
  onAction,
  getActions,
}: ActionsColumnParams<T>): Column<T> => ({
  key: "actions",
  header,
  render: (row) => {
    const actions = mapActions(getActions(row));

    if (actions.length === 0) {
      return <span className="text-gray-500">—</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.uiKey}
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(action);
            }}
            isLoading={activeActionKey === action.uiKey}
            disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
            className={cn(
              "min-w-[90px]",
              action.confirm && "border-orange-200 text-orange-700 hover:bg-orange-50",
            )}
          >
            {action.label || "—"}
          </Button>
        ))}
      </div>
    );
  },
});
