import { Link } from "react-router-dom";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { SignalBadge } from "../../../components/ui/SignalBadge";
import { DaysDisplay } from "../../../components/ui/DaysDisplay";
import { SortableHeader } from "../../../components/ui/SortableHeader";
import type { BinderResponse } from "../types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import { mapActions } from "../../../lib/actions/mapActions";
import {
  getStatusLabel,
  getBinderTypeLabel,
  getSignalLabel,
} from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { type RefObject } from "react";
import { BINDER_SIGNAL_VARIANTS, BINDER_STATUS_VARIANTS, SIGNAL_DOT_COLORS } from "../constants";

/* ─── Client + signals cell ──────────────────────────────────── */

// eslint-disable-next-line react-refresh/only-export-components
const ClientCell: React.FC<{ binder: BinderResponse }> = ({ binder }) => {
  const signals = Array.isArray(binder.signals) ? binder.signals : [];
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        to={`/clients/${binder.client_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold text-gray-900 hover:text-primary-700 hover:underline"
      >
        {binder.client_name ?? `#${binder.client_id}`}
      </Link>
      {signals.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {signals.map((signal) => (
            <SignalBadge
              key={signal}
              signal={signal}
              label={getSignalLabel(signal)}
              variant={BINDER_SIGNAL_VARIANTS[signal] as "warning" | "info" | "neutral" | undefined ?? "neutral"}
              dotColor={SIGNAL_DOT_COLORS[signal]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
ClientCell.displayName = "ClientCell";

/* ─── Smart action cell ──────────────────────────────────────── */

interface ActionCellProps {
  binder: BinderResponse;
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const ActionCell: React.FC<ActionCellProps> = ({ binder, activeActionKeyRef, onAction }) => {
  const actions = mapActions(binder.available_actions as BackendAction[] | null | undefined);
  const action =
    actions.find((candidate) => candidate.key === "ready") ??
    actions.find((candidate) => candidate.key === "return") ??
    actions[0] ??
    null;

  if (!action) return <span className="text-sm text-gray-400">—</span>;

  const isReadyAction = action.key === "ready";

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      onClick={(e) => { e.stopPropagation(); onAction(action); }}
      isLoading={activeActionKeyRef.current === action.uiKey}
      disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
      className={isReadyAction ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm" : undefined}
    >
      {action.label}
    </Button>
  );
};
ActionCell.displayName = "ActionCell";

/* ─── Column builder ─────────────────────────────────────────── */

interface BuildBindersColumnsParams {
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
  sortBy: string;
  sortDir: string;
  onSort: (key: string) => void;
}

export const buildBindersColumns = ({
  activeActionKeyRef,
  onAction,
  sortBy,
  sortDir,
  onSort,
}: BuildBindersColumnsParams): Column<BinderResponse>[] => [
  {
    key: "client_name",
    header: "לקוח",
    headerRender: () => (
      <SortableHeader label="לקוח" columnKey="client_name" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    ),
    render: (binder) => <ClientCell binder={binder} />,
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
    headerRender: () => (
      <SortableHeader label="סטטוס" columnKey="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    ),
    render: (binder) => (
      <StatusBadge
        status={binder.status}
        getLabel={getStatusLabel}
        variantMap={BINDER_STATUS_VARIANTS}
      />
    ),
  },
  {
    key: "received_at",
    header: "תאריך קבלה",
    headerRender: () => (
      <SortableHeader label="תאריך קבלה" columnKey="received_at" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    ),
    render: (binder) => (
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDate(binder.received_at)}
      </span>
    ),
  },
  {
    key: "days_in_office",
    header: "ימים במשרד",
    headerRender: () => (
      <SortableHeader label="ימים במשרד" columnKey="days_in_office" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    ),
    render: (binder) => <DaysDisplay days={binder.days_in_office} returned={binder.status === "returned"} />,
  },
  {
    key: "actions",
    header: "פעולות",
    render: (binder) => (
      <ActionCell binder={binder} activeActionKeyRef={activeActionKeyRef} onAction={onAction} />
    ),
  },
];
