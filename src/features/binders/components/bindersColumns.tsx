import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { buildActionsColumn } from "../../../components/ui/columnHelpers";
import type { BinderResponse } from "../../../api/binders.types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import {
  getStatusLabel,
  getSignalLabel,
  getWorkStateLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";
import { type RefObject } from "react";
import { BINDER_SIGNAL_VARIANTS, BINDER_WORK_STATE_VARIANTS } from "../types";

/* ─── Variant maps ───────────────────────────────────────────── */

const binderStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  in_office: "info",
  ready_for_pickup: "success",
};

/* ─── Days-in-office cell ────────────────────────────────────── */

const DaysCell: React.FC<{ days: number | null | undefined }> = ({ days }) => {
  if (days == null) return <span className="text-gray-400">—</span>;

  const urgency =
    days > 90
      ? "text-red-600 font-bold"
      : days > 60
        ? "text-orange-500 font-semibold"
        : "text-gray-700";

  return (
    <span className={cn("font-mono text-sm tabular-nums", urgency)}>
      {days}
    </span>
  );
};
DaysCell.displayName = "DaysCell";

/* ─── Signals cell ───────────────────────────────────────────── */

const SignalsCell: React.FC<{ signals: string[] | null | undefined }> = ({ signals }) => {
  if (!Array.isArray(signals) || signals.length === 0) {
    return <span className="text-sm text-gray-400">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {signals.map((signal) => (
        <Badge key={signal} variant={BINDER_SIGNAL_VARIANTS[signal] ?? "neutral"}>
          {getSignalLabel(signal)}
        </Badge>
      ))}
    </div>
  );
};
SignalsCell.displayName = "SignalsCell";

/* ─── Column builder ─────────────────────────────────────────── */

interface BuildBindersColumnsParams {
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

export const buildBindersColumns = ({
  activeActionKeyRef,
  onAction,
}: BuildBindersColumnsParams): Column<BinderResponse>[] => [
  {
    key: "client_name",
    header: "לקוח",
    render: (binder) => (
      <Link
        to={`/clients/${binder.client_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold text-gray-900 hover:text-blue-700 hover:underline"
      >
        {binder.client_name ?? `#${binder.client_id}`}
      </Link>
    ),
  },
  {
    key: "binder_number",
    header: "מספר קלסר",
    render: (binder) => (
      <span className="font-mono text-sm font-semibold text-gray-700">
        {binder.binder_number}
      </span>
    ),
  },
  {
    key: "binder_type",
    header: "סוג חומר",
    render: (binder) => (
      <span className="text-sm text-gray-600">
        {getBinderTypeLabel(binder.binder_type)}
      </span>
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
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDate(binder.received_at)}
      </span>
    ),
  },
  {
    key: "days_in_office",
    header: "ימים במשרד",
    render: (binder) => <DaysCell days={binder.days_in_office} />,
  },
  {
    key: "work_state",
    header: "מצב עבודה",
    render: (binder) => (
      <Badge variant={BINDER_WORK_STATE_VARIANTS[binder.work_state ?? ""] ?? "neutral"}>
        {getWorkStateLabel(binder.work_state ?? "")}
      </Badge>
    ),
  },
  {
    key: "signals",
    header: "אותות",
    render: (binder) => <SignalsCell signals={binder.signals} />,
  },
  buildActionsColumn<BinderResponse>({
    header: "פעולות מהירות",
    activeActionKeyRef,
    onAction,
    getActions: (binder) => binder.available_actions as BackendAction[] | null | undefined,
  }),
];