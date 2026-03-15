import { Link } from "react-router-dom";
import type { Column } from "../../../components/ui/DataTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Badge } from "../../../components/ui/Badge";
import { MonoValue } from "../../../components/ui/MonoValue";
import { SortableHeader } from "../../../components/ui/SortableHeader";
import type { BinderResponse } from "../types";
import {
  getStatusLabel,
  getBinderTypeLabel,
  getSignalLabel,
} from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { BINDER_SIGNAL_VARIANTS, BINDER_STATUS_VARIANTS, SIGNAL_DOT_COLORS } from "../constants";
import { BinderRowActions } from "./BinderRowActions";

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
            <Badge
              key={signal}
              variant={BINDER_SIGNAL_VARIANTS[signal] as "warning" | "info" | "neutral" | undefined ?? "neutral"}
              dot={SIGNAL_DOT_COLORS[signal]}
            >
              {getSignalLabel(signal)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
ClientCell.displayName = "ClientCell";

/* ─── Column builder ─────────────────────────────────────────── */

interface BuildBindersColumnsParams {
  actionLoadingId: number | null;
  onMarkReady: (binderId: number) => void;
  onReturn: (binderId: number) => void;
  onOpenDetail: (binderId: number) => void;
  onDelete: (binderId: number) => void;
  sortBy: string;
  sortDir: string;
  onSort: (key: string) => void;
}

export const buildBindersColumns = ({
  actionLoadingId,
  onMarkReady,
  onReturn,
  onOpenDetail,
  onDelete,
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
    render: (binder) => <MonoValue value={binder.days_in_office} format="days" returned={binder.status === "returned"} />,
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    render: (binder) => (
      <BinderRowActions
        binderId={binder.id}
        status={binder.status}
        disabled={actionLoadingId !== null}
        onOpenDetail={() => onOpenDetail(binder.id)}
        onMarkReady={() => onMarkReady(binder.id)}
        onReturn={() => onReturn(binder.id)}
        onDelete={() => onDelete(binder.id)}
      />
    ),
  },
];
