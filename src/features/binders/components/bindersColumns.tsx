import { type RefObject } from "react";
import { Badge } from "../../../components/ui/Badge";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { buildActionsColumn } from "../../../components/ui/columnHelpers";
import type { BinderResponse } from "../../../api/binders.types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import { getStatusLabel, getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";

const binderStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  in_office: "info",
  ready_for_pickup: "success",
  overdue: "error",
};

const slaStateVariants: Record<string, "success" | "warning" | "error" | "neutral"> = {
  on_track: "success",
  approaching: "warning",
  overdue: "error",
};

const workStateVariants: Record<string, "neutral" | "info" | "success"> = {
  waiting_for_work: "neutral",
  in_progress: "info",
  completed: "success",
};

const signalVariants: Record<string, "error" | "warning" | "info" | "neutral"> = {
  overdue: "error",
  near_sla: "warning",
  missing_permanent_documents: "warning",
  unpaid_charges: "warning",
  ready_for_pickup: "info",
  idle_binder: "neutral",
};

interface BuildBindersColumnsParams {
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

export const buildBindersColumns = ({
  activeActionKeyRef,
  onAction,
}: BuildBindersColumnsParams): Column<BinderResponse>[] => [
  {
    key: "binder_number",
    header: "מספר קלסר",
    render: (binder) => (
      <span className="font-mono text-sm font-semibold text-gray-900">{binder.binder_number}</span>
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
      <span className="text-sm text-gray-600">{formatDate(binder.received_at)}</span>
    ),
  },
  {
    key: "expected_return_at",
    header: "החזרה צפויה",
    render: (binder) => (
      <span className="text-sm text-gray-600">{formatDate(binder.expected_return_at)}</span>
    ),
  },
  {
    key: "days_in_office",
    header: "ימים במשרד",
    render: (binder) => (
      <span className="font-mono text-sm font-medium text-gray-900">{binder.days_in_office ?? "—"}</span>
    ),
  },
  {
    key: "work_state",
    header: "מצב עבודה",
    render: (binder) => {
      const variant = workStateVariants[binder.work_state ?? ""] ?? "neutral";
      return (
        <Badge variant={variant}>{getWorkStateLabel(binder.work_state ?? "")}</Badge>
      );
    },
  },
  {
    key: "sla_state",
    header: "מצב SLA",
    render: (binder) => {
      const variant = slaStateVariants[binder.sla_state ?? ""] ?? "neutral";
      return (
        <Badge variant={variant}>{getSlaStateLabel(binder.sla_state ?? "")}</Badge>
      );
    },
  },
  {
    key: "signals",
    header: "אותות",
    render: (binder) => {
      if (!Array.isArray(binder.signals) || binder.signals.length === 0) {
        return <span className="text-gray-400">—</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {binder.signals.map((signal) => (
            <Badge
              key={`${binder.id}-${signal}`}
              variant={signalVariants[signal] ?? "neutral"}
            >
              {getSignalLabel(signal)}
            </Badge>
          ))}
        </div>
      );
    },
  },
  buildActionsColumn<BinderResponse>({
    header: "פעולות",
    activeActionKeyRef,
    onAction,
    getActions: (binder) => binder.available_actions as BackendAction[] | null | undefined,
  }),
];
