import React from "react";
import { ActionButton } from "../../actions/components/ActionButton";
import { resolveEntityActions, resolveStandaloneActions } from "../../actions/resolveActions";
import type { BackendActionInput, ResolvedBackendAction } from "../../actions/types";

interface TimelineActionRowProps {
  actions: BackendActionInput[] | null | undefined;
  binderId: number | null;
  chargeId: number | null;
  scopeKey: string;
  activeActionKey: string | null;
  onAction: (action: ResolvedBackendAction) => void;
}

export const TimelineActionRow: React.FC<TimelineActionRowProps> = ({
  actions,
  binderId,
  chargeId,
  scopeKey,
  activeActionKey,
  onAction,
}) => {
  const resolvedActions =
    binderId !== null
      ? resolveEntityActions(actions, "/binders", binderId, scopeKey)
      : chargeId !== null
        ? resolveEntityActions(actions, "/charges", chargeId, scopeKey)
        : resolveStandaloneActions(actions, scopeKey);

  if (resolvedActions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {resolvedActions.map((action) => (
        <ActionButton
          key={action.uiKey}
          type="button"
          variant="outline"
          label={action.label}
          onClick={() => onAction(action)}
          isLoading={activeActionKey === action.uiKey}
          disabled={!action.endpoint || (activeActionKey !== null && activeActionKey !== action.uiKey)}
        />
      ))}
    </div>
  );
};
