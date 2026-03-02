import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Button } from "../../../components/ui/Button";
import type { BinderResponse } from "../../../api/binders.types";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import { mapActions } from "../../../lib/actions/mapActions";
import {
  getStatusLabel,
  getWorkStateLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";
import { type RefObject } from "react";
import { BINDER_WORK_STATE_VARIANTS } from "../types";

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

/* ─── Smart action cell ──────────────────────────────────────── */

interface ActionCellProps {
  binder: BinderResponse;
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ binder, activeActionKeyRef, onAction }) => {
  const actions = mapActions(binder.available_actions as BackendAction[] | null | undefined);
  const action = actions[0] ?? null;

  if (binder.status === "ready_for_pickup") {
    if (!action) return <span className="text-sm text-gray-400">—</span>;
    return (
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={(e) => { e.stopPropagation(); onAction(action); }}
        isLoading={activeActionKeyRef.current === action.uiKey}
        disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
      >
        החזרת קלסר
      </Button>
    );
  }

  if (binder.status === "in_office" && binder.work_state === "in_progress") {
    if (!action) return <span className="text-sm text-gray-400">—</span>;
    return (
      <Button
        type="button"
        size="sm"
        onClick={(e) => { e.stopPropagation(); onAction(action); }}
        isLoading={activeActionKeyRef.current === action.uiKey}
        disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
        className="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm"
      >
        סיום טיפול
      </Button>
    );
  }

  return <span className="text-sm text-gray-400">ממתין</span>;
};
ActionCell.displayName = "ActionCell";

/* ─── Sortable header ────────────────────────────────────────── */

interface SortableHeaderProps {
  label: string;
  columnKey: string;
  sortBy: string;
  sortDir: string;
  onSort: (key: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, columnKey, sortBy, sortDir, onSort }) => {
  const isActive = sortBy === columnKey;
  const Icon = isActive ? (sortDir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className={cn(
        "inline-flex items-center gap-1 font-semibold uppercase tracking-wide",
        isActive ? "text-gray-800" : "text-gray-500 hover:text-gray-700",
      )}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" />
    </button>
  );
};
SortableHeader.displayName = "SortableHeader";

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
    render: (binder) => (
      <Link
        to={`/clients/${binder.client_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold text-gray-900 hover:text-primary-700 hover:underline"
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
    headerRender: () => (
      <SortableHeader label="סטטוס" columnKey="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    ),
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
    key: "actions",
    header: "פעולות",
    render: (binder) => (
      <ActionCell binder={binder} activeActionKeyRef={activeActionKeyRef} onAction={onAction} />
    ),
  },
];