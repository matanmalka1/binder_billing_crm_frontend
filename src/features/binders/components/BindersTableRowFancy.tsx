import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ChevronLeft, AlertCircle, CheckCircle } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { getStatusBadge } from "./bindersTable.utils";
import { cn } from "../../../utils/utils";
import type { ActionCommand } from "../../../lib/actions/types";
import type { BinderResponse } from "../../../api/binders.types";

interface RowProps {
  binder: BinderResponse;
  index: number;
  activeActionKey: string | null;
  onActionClick: (action: ActionCommand) => void;
}

export const BindersTableRowFancy: React.FC<RowProps> = ({
  binder,
  index,
  activeActionKey,
  onActionClick,
}) => {
  const actions = mapActions(binder.available_actions, {
    scopeKey: `binder-${binder.id}`,
  });

  return (
    <tr
      className={cn(
        "group transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <td className="py-4 pr-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="font-mono text-sm font-semibold text-gray-900">
            {binder.binder_number}
          </span>
        </div>
      </td>

      <td className="py-4 pr-4">{getStatusBadge(binder.status)}</td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-600">{formatDate(binder.received_at)}</span>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-600">{formatDate(binder.expected_return_at)}</span>
      </td>

      <td className="py-4 pr-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{binder.days_in_office}</span>
          {(binder.days_in_office ?? 0) > 60 && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
          {(binder.days_in_office ?? 0) <= 30 && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">
          {getWorkStateLabel(binder.work_state ?? "")}
        </span>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">
          {getSlaStateLabel(binder.sla_state ?? "")}
        </span>
      </td>

      <td className="py-4 pr-4">
        {Array.isArray(binder.signals) && binder.signals.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {binder.signals.map((signal) => (
              <Badge key={`${binder.id}-${signal}`} variant="neutral" className="text-xs">
                {getSignalLabel(signal)}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      <td className="py-4 pr-4">
        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.uiKey}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onActionClick(action)}
                isLoading={activeActionKey === action.uiKey}
                disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
                rightIcon={<ChevronLeft className="h-3 w-3" />}
              >
                {action.label || "—"}
              </Button>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
};
