import React from "react";
import { ActionButton } from "../../actions/components/ActionButton";
import { resolveActions } from "../../../lib/actions/adapter";
import type { TimelineActionRowProps } from "../types";

export const TimelineActionRow: React.FC<TimelineActionRowProps> = ({
  actions,
  binderId,
  chargeId,
  scopeKey,
  activeActionKey,
  onAction,
}) => {
  const resolvedContext =
    binderId !== null
      ? { entityPath: "/binders", entityId: binderId, scopeKey }
      : chargeId !== null
        ? { entityPath: "/charges", entityId: chargeId, scopeKey }
        : { scopeKey };

  const resolvedActions = resolveActions(actions, resolvedContext);

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
          disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
        />
      ))}
    </div>
  );
};
