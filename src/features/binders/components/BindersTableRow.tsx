import React from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { resolveActions } from "../../../lib/actions/adapter";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { formatDate, getStatusBadge } from "./bindersTable.utils";
import type { BindersTableRowProps } from "../types";

const BindersTableRowView: React.FC<BindersTableRowProps> = ({
  binder,
  activeActionKey,
  onActionClick,
}) => {
  const actions = resolveActions(binder.available_actions, {
    entityPath: "/binders",
    entityId: binder.id,
    scopeKey: `binder-${binder.id}`,
  });

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 pr-4 font-medium text-gray-900">{binder.binder_number}</td>
      <td className="py-3 pr-4">{getStatusBadge(binder.status)}</td>
      <td className="py-3 pr-4 text-gray-600">{formatDate(binder.received_at)}</td>
      <td className="py-3 pr-4 text-gray-600">{formatDate(binder.expected_return_at)}</td>
      <td className="py-3 pr-4 font-medium text-gray-900">{binder.days_in_office}</td>
      <td className="py-3 pr-4 text-gray-600">{getWorkStateLabel(binder.work_state ?? "")}</td>
      <td className="py-3 pr-4 text-gray-600">{getSlaStateLabel(binder.sla_state ?? "")}</td>
      <td className="py-3 pr-4">
        {Array.isArray(binder.signals) && binder.signals.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {binder.signals.map((signal) => (
              <Badge key={`${binder.id}-${signal}`} variant="neutral">
                {getSignalLabel(signal)}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
      <td className="py-3 pr-4">
        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.uiKey}
                type="button"
                variant="outline"
                onClick={() => onActionClick(action)}
                isLoading={activeActionKey === action.uiKey}
                disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
              >
                {action.label || "—"}
              </Button>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
    </tr>
  );
};

const keyBelongsToBinderRow = (key: string | null, binderId: number): boolean => {
  if (!key) return false;
  return key.startsWith(`binder-${binderId}-`);
};

export const BindersTableRow = React.memo(
  BindersTableRowView,
  (prevProps, nextProps) => {
    if (prevProps.binder !== nextProps.binder) return false;
    if (prevProps.onActionClick !== nextProps.onActionClick) return false;

    const previousKey = prevProps.activeActionKey;
    const nextKey = nextProps.activeActionKey;

    const didNullStateChange = (previousKey === null) !== (nextKey === null);
    if (didNullStateChange) return false;

    const rowBinderId = nextProps.binder.id;
    if (keyBelongsToBinderRow(previousKey, rowBinderId)) return false;
    if (keyBelongsToBinderRow(nextKey, rowBinderId)) return false;

    return true;
  },
);
