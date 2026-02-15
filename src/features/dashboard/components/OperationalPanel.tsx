import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { mapActions } from "../../../lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "../../../lib/actions/types";

interface OperationalPanelProps {
  quickActions: BackendAction[];
  activeActionKey: string | null;
  onQuickAction: (action: ActionCommand) => void;
}

export const OperationalPanel: React.FC<OperationalPanelProps> = ({
  quickActions,
  activeActionKey,
  onQuickAction,
}) => {
  const actions = mapActions(quickActions, { scopeKey: "dashboard-quick" });

  if (actions.length === 0) {
    return null;
  }

  return (
    <Card title="פאנל תפעולי">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.uiKey}
            type="button"
            variant="outline"
            onClick={() => onQuickAction(action)}
            isLoading={activeActionKey === action.uiKey}
            disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
          >
            {action.label || "—"}
          </Button>
        ))}
      </div>
    </Card>
  );
};
