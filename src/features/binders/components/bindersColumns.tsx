import { type RefObject } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { buildActionsColumn } from "../../../components/ui/columnHelpers";
import type { BinderResponse } from "../../../api/binders.types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import {
  getStatusLabel,
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";

/* ─── Variant maps ───────────────────────────────────────────── */

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

/* ─── Days-in-office cell ────────────────────────────────────── */

const DaysCell: React.FC<{ days: number | null | undefined }> = ({ days }) => {
  if (days == null) return <span className="text-gray-400">—</span>;

  const urgency = days > 90 ? "text-red-700 font-bold" : days > 60 ? "text-orange-600 font-semibold" : "text-gray-900";

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
    return <span className="text-gray-400 text-sm">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {signals.map((signal) => (
        <Badge key={signal} variant={signalVariants[signal] ?? "neutral"}>
          {getSignalLabel(signal)}
        </Badge>
      ))}
    </div>
  );
};
SignalsCell.displayName = "SignalsCell";

/* ─── Inline quick-actions cell ──────────────────────────────── */

interface QuickActionsCellProps {
  binder: BinderResponse;
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

const QuickActionsCell: React.FC<QuickActionsCellProps> = ({ binder, activeActionKeyRef, onAction }) => {
  const canMarkReady = binder.status === "in_office";
  const canReturn = binder.status === "ready_for_pickup";

  const isActive = (key: string) => activeActionKeyRef.current === key;

  const handleReady = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction({
      key: "mark_ready",
      id: String(binder.id),
      method: "POST",
      endpoint: `/api/v1/binders/${binder.id}/ready`,
      uiKey: `binder-ready-${binder.id}`,
      label: "מוכן לאיסוף",
    });
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction({
      key: "return_binder",
      id: String(binder.id),
      method: "POST",
      endpoint: `/api/v1/binders/${binder.id}/return`,
      uiKey: `binder-return-${binder.id}`,
      label: "החזר קלסר",
      confirm: {
        title: "החזרת קלסר",
        message: "האם לאשר את החזרת הקלסר ללקוח?",
        confirmLabel: "אישור",
        cancelLabel: "ביטול",
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {canMarkReady && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isActive(`binder-ready-${binder.id}`)}
          onClick={handleReady}
        >
          מוכן לאיסוף
        </Button>
      )}
      {canReturn && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          isLoading={isActive(`binder-return-${binder.id}`)}
          onClick={handleReturn}
        >
          החזר
        </Button>
      )}
    </div>
  );
};
QuickActionsCell.displayName = "QuickActionsCell";

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
        className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:underline"
      >
        {binder.client_name ?? `#${binder.client_id}`}
      </Link>
    ),
  },
  {
    key: "binder_number",
    header: "מספר קלסר",
    render: (binder) => (
      <span className="font-mono text-sm font-semibold text-gray-900">
        {binder.binder_number}
      </span>
    ),
  },
  {
    key: "binder_type",
    header: "סוג חומר",
    render: (binder) => (
      <span className="text-sm text-gray-700">
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
      <span className="text-sm text-gray-600 tabular-nums">
        {formatDate(binder.received_at)}
      </span>
    ),
  },
  {
    key: "expected_return_at",
    header: "החזרה צפויה",
    render: (binder) => (
      <span className="text-sm text-gray-600 tabular-nums">
        {formatDate(binder.expected_return_at)}
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
      <Badge variant={workStateVariants[binder.work_state ?? ""] ?? "neutral"}>
        {getWorkStateLabel(binder.work_state ?? "")}
      </Badge>
    ),
  },
  {
    key: "sla_state",
    header: "מצב SLA",
    render: (binder) => (
      <Badge variant={slaStateVariants[binder.sla_state ?? ""] ?? "neutral"}>
        {getSlaStateLabel(binder.sla_state ?? "")}
      </Badge>
    ),
  },
  {
    key: "signals",
    header: "אותות",
    render: (binder) => <SignalsCell signals={binder.signals} />,
  },
  {
    key: "quick_actions",
    header: "פעולות מהירות",
    render: (binder) => (
      <QuickActionsCell
        binder={binder}
        activeActionKeyRef={activeActionKeyRef}
        onAction={onAction}
      />
    ),
  },
  buildActionsColumn<BinderResponse>({
    header: "",
    activeActionKeyRef,
    onAction,
    getActions: (binder) => binder.available_actions as BackendAction[] | null | undefined,
  }),
];
