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

// Priority: lower index = higher severity shown first
const SIGNAL_PRIORITY = ["unpaid_charges", "missing_permanent_documents", "ready_for_pickup", "idle_binder"];

const sortByPriority = (signals: string[]) =>
  [...signals].sort((a, b) => {
    const ai = SIGNAL_PRIORITY.indexOf(a);
    const bi = SIGNAL_PRIORITY.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

const SignalsCell: React.FC<{ signals: string[] | null | undefined }> = ({ signals }) => {
  if (!Array.isArray(signals) || signals.length === 0) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  const sorted = sortByPriority(signals);
  const [primary, ...rest] = sorted;

  return (
    <div className="flex items-center gap-1">
      <Badge variant={BINDER_SIGNAL_VARIANTS[primary] ?? "neutral"}>
        {getSignalLabel(primary)}
      </Badge>
      {rest.length > 0 && (
        <span
          className="inline-flex h-5 items-center rounded-full bg-gray-100 px-1.5 text-[11px] font-semibold text-gray-500 cursor-default"
          title={rest.map(getSignalLabel).join(" · ")}
        >
          +{rest.length}
        </span>
      )}
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