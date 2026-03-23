import { Link } from "react-router-dom";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ChargeResponse } from "../api";
import { getChargeAmountText, getChargeTypeLabel } from "../utils";
import { formatDate } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";
import { ChargeRowActions } from "./ChargeRowActions";
import { chargeStatusVariants } from "../constants";

export type ChargeAction = "issue" | "markPaid" | "cancel";

interface BuildChargeColumnsParams {
  isAdvisor: boolean;
  actionLoadingId: number | null;
  runAction: (chargeId: number, action: ChargeAction) => Promise<void>;
  onOpenDetail: (chargeId: number) => void;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  onToggleAll?: (ids: number[]) => void;
  allIds?: number[];
}

export const buildChargeColumns = ({
  isAdvisor,
  actionLoadingId,
  runAction,
  onOpenDetail,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  allIds = [],
}: BuildChargeColumnsParams): Column<ChargeResponse>[] => {
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds?.has(id));
  const someSelected = !allSelected && allIds.some((id) => selectedIds?.has(id));

  /* Checkbox — rightmost in RTL (first in DOM) */
  const checkboxColumn: Column<ChargeResponse> = {
    key: "select",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    headerRender: () => (
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => { if (el) el.indeterminate = someSelected; }}
        onChange={() => onToggleAll?.(allIds)}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        aria-label="בחר הכל"
      />
    ),
    render: (charge) => (
      <input
        type="checkbox"
        checked={selectedIds?.has(charge.id) ?? false}
        onChange={() => onToggleSelect?.(charge.id)}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        aria-label={`בחר חיוב ${charge.id}`}
      />
    ),
  };

  const dataColumns: Column<ChargeResponse>[] = [
    {
      key: "id",
      header: "#",
      headerClassName: "w-10 text-center",
      className: "w-10 text-center",
      render: (charge) => (
        <span className="font-mono text-xs text-gray-400 tabular-nums">{charge.id}</span>
      ),
    },
    {
      key: "client_id",
      header: "לקוח",
      headerClassName: "w-48",
      className: "w-48 max-w-[12rem]",
      render: (charge) => (
        <Link
          to={`/clients/${charge.client_id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold text-gray-900 hover:text-primary-700 hover:underline"
        >
          {charge.client_name ?? `#${charge.client_id}`}
        </Link>
      ),
    },
    {
      key: "charge_type",
      header: "סוג",
      headerClassName: "w-24",
      className: "w-24",
      render: (charge) => (
        <span className="text-sm text-gray-500">{getChargeTypeLabel(charge.charge_type)}</span>
      ),
    },
    {
      key: "period",
      header: "תקופה",
      headerClassName: "w-24",
      className: "w-24",
      render: (charge) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">{charge.period ?? "—"}</span>
      ),
    },
    {
      key: "status",
      header: "סטטוס",
      headerClassName: "w-28",
      className: "w-28",
      render: (charge) => (
        <StatusBadge
          status={charge.status}
          getLabel={getChargeStatusLabel}
          variantMap={chargeStatusVariants}
        />
      ),
    },
    {
      key: "amount",
      header: "סכום",
      headerClassName: "w-36",
      className: "w-36",
      render: (charge) => (
        <span className="font-mono text-sm font-semibold text-gray-900 tabular-nums">
          {getChargeAmountText(charge)}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "תאריך",
      headerClassName: "w-24",
      className: "w-24",
      render: (charge) => (
        <span className="text-sm text-gray-400 tabular-nums">{formatDate(charge.created_at)}</span>
      ),
    },
    /* Actions — last in DOM = leftmost in RTL */
    {
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (charge) => (
        <ChargeRowActions
          chargeId={charge.id}
          status={charge.status}
          disabled={actionLoadingId !== null}
          onOpenDetail={() => onOpenDetail(charge.id)}
          onIssue={() => void runAction(charge.id, "issue")}
          onMarkPaid={() => void runAction(charge.id, "markPaid")}
          onCancel={() => void runAction(charge.id, "cancel")}
          showActions={isAdvisor}
        />
      ),
    },
  ];

  if (isAdvisor && onToggleSelect) {
    return [checkboxColumn, ...dataColumns];
  }
  return dataColumns;
};
