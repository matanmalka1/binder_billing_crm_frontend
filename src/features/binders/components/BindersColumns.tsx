import { Link } from "react-router-dom";
import type { Column } from "../../../components/ui/table/DataTable";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import { MonoValue } from "../../../components/ui/primitives/MonoValue";
import type { BinderResponse } from "../types";
import { getStatusLabel } from "../../../utils/enums";
import { formatBinderNumber, formatClientOfficeId, formatMonthYear } from "../../../utils/utils";
import { BINDER_STATUS_VARIANTS } from "../constants";
import { BinderRowActions } from "./BinderRowActions";

/* ─── Client cell ────────────────────────────────────────────── */

// eslint-disable-next-line react-refresh/only-export-components
const ClientCell: React.FC<{ binder: BinderResponse }> = ({ binder }) => {
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        to={`/clients/${binder.client_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold text-gray-900 hover:text-primary-700 hover:underline"
      >
        {binder.client_name ?? `#${binder.client_id}`}
      </Link>
    </div>
  );
};
ClientCell.displayName = "ClientCell";

/* ─── Column builder ─────────────────────────────────────────── */

interface BuildBindersColumnsParams {
  actionLoadingId: number | null;
  onMarkReady: (binderId: number) => void;
  onRevertReady: (binderId: number) => void;
  onReturn: (binderId: number) => void;
  onOpenDetail: (binderId: number) => void;
  onDelete: (binderId: number) => void;
}

export const buildBindersColumns = ({
  actionLoadingId,
  onMarkReady,
  onRevertReady,
  onReturn,
  onOpenDetail,
  onDelete,
}: BuildBindersColumnsParams): Column<BinderResponse>[] => [
  {
    key: "office_client_number",
    header: "מס' לקוח",
    render: (binder) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">
        {formatClientOfficeId(binder.office_client_number)}
      </span>
    ),
  },
  {
    key: "client_name",
    header: "לקוח",
    render: (binder) => <ClientCell binder={binder} />,
  },
  {
    key: "client_id_number",
    header: "ת.ז / ח.פ",
    render: (binder) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">
        {binder.client_id_number ?? "—"}
      </span>
    ),
  },
  {
    key: "binder_number",
    header: "מספר קלסר",
    render: (binder) => (
      <span className="font-mono text-sm font-semibold text-gray-700">
        {formatBinderNumber(binder.binder_number)}
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
        variantMap={BINDER_STATUS_VARIANTS}
      />
    ),
  },
  {
    key: "period_start",
    header: "תקופה",
    render: (binder) => {
      if (!binder.period_start && !binder.period_end) {
        return <span className="text-sm text-gray-400">—</span>;
      }
      const start = formatMonthYear(binder.period_start);
      const end = binder.period_end ? formatMonthYear(binder.period_end) : "פעיל";
      return (
        <span className="text-sm text-gray-600 tabular-nums">
          {`${start} - ${end}`}
        </span>
      );
    },
  },
  {
    key: "days_in_office",
    header: "ימים במשרד",
    render: (binder) => (
      <MonoValue
        value={binder.days_in_office}
        format="days"
        returned={binder.status === "returned"}
      />
    ),
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
        onRevertReady={() => onRevertReady(binder.id)}
        onReturn={() => onReturn(binder.id)}
        onDelete={() => onDelete(binder.id)}
      />
    ),
  },
];
