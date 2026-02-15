import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { mapActions } from "../../../lib/actions/mapActions";
import type { BinderResponse } from "../../../api/binders.types";
import type { ActionCommand } from "../../../lib/actions/types";
import { getStatusLabel, getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";

const binderStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  in_office: "info",
  ready_for_pickup: "success",
  overdue: "error",
};

interface BuildBindersColumnsParams {
  activeActionKey: string | null;
  handleActionClick: (action: ActionCommand) => void;
}

export const buildBindersColumns = ({
  activeActionKey,
  handleActionClick,
}: BuildBindersColumnsParams): Column<BinderResponse>[] => [
  {
    key: "binder_number",
    header: "מספר תיק",
    render: (binder) => (
      <span className="font-medium text-gray-900">{binder.binder_number}</span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (binder) => (
      <StatusBadge
        status={binder.status}
        getLabel={getStatusLabel}
        variantMap={binderStatusVariants}
      />
    ),
  },
  {
    key: "received_at",
    header: "תאריך קבלה",
    render: (binder) => (
      <span className="text-gray-600">{formatDate(binder.received_at)}</span>
    ),
  },
  {
    key: "expected_return_at",
    header: "תאריך החזרה צפוי",
    render: (binder) => (
      <span className="text-gray-600">{formatDate(binder.expected_return_at)}</span>
    ),
  },
  {
    key: "days_in_office",
    header: "ימים במשרד",
    render: (binder) => (
      <span className="font-medium text-gray-900">{binder.days_in_office ?? "—"}</span>
    ),
  },
  {
    key: "work_state",
    header: "מצב עבודה",
    render: (binder) => (
      <span className="text-gray-600">{getWorkStateLabel(binder.work_state ?? "")}</span>
    ),
  },
  {
    key: "sla_state",
    header: "מצב SLA",
    render: (binder) => (
      <span className="text-gray-600">{getSlaStateLabel(binder.sla_state ?? "")}</span>
    ),
  },
  {
    key: "signals",
    header: "אותות",
    render: (binder) => {
      if (!Array.isArray(binder.signals) || binder.signals.length === 0) {
        return <span className="text-gray-500">—</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {binder.signals.map((signal) => (
            <Badge key={`${binder.id}-${signal}`} variant="neutral">
              {getSignalLabel(signal)}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    key: "actions",
    header: "פעולות",
    render: (binder) => {
      const actions = mapActions(binder.available_actions);

      if (actions.length === 0) {
        return <span className="text-gray-500">—</span>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {actions.map((action: ActionCommand) => (
            <Button
              key={action.uiKey}
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(action);
              }}
              isLoading={activeActionKey === action.uiKey}
              disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
            >
              {action.label || "—"}
            </Button>
          ))}
        </div>
      );
    },
  },
];
