import React from "react";
import { Card } from "../../../components/ui/Card";
import { ActionButton } from "../../actions/components/ActionButton";
import { resolveStandaloneActions } from "../../actions/resolveActions";
import type { BackendActionInput, ResolvedBackendAction } from "../../actions/types";

interface OperationalPanelProps {
  quickActions: BackendActionInput[];
  activeActionKey: string | null;
  onQuickAction: (action: ResolvedBackendAction) => void;
}

export const OperationalPanel: React.FC<OperationalPanelProps> = ({
  quickActions,
  activeActionKey,
  onQuickAction,
}) => {
  const actions = resolveStandaloneActions(quickActions, "dashboard-quick");

  if (actions.length === 0) {
    return null;
  }

  return (
    <Card title="פאנל תפעולי">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <ActionButton
            key={action.uiKey}
            type="button"
            variant="outline"
            label={action.label}
            onClick={() => onQuickAction(action)}
            isLoading={activeActionKey === action.uiKey}
            disabled={!action.endpoint || (activeActionKey !== null && activeActionKey !== action.uiKey)}
          />
        ))}
      </div>
    </Card>
  );
};
