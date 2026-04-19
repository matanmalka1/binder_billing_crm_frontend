import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import type { Column } from "../../../components/ui/table/DataTable";
import { buildSelectionColumn } from "../../../components/ui/table/tableSelection";
import type { ChargeResponse } from "../api";
import { getChargeAmountText, getChargePeriodLabel, getChargeTypeLabel } from "../utils";
import { formatClientOfficeId, formatDate } from "../../../utils/utils";
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
  const dataColumns: Column<ChargeResponse>[] = [
    {
      key: "office_client_number",
      header: "מס' לקוח",
      headerClassName: "w-28",
      className: "w-28",
      render: (charge) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">
          {formatClientOfficeId(charge.office_client_number)}
        </span>
      ),
    },
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
      key: "business_id",
      header: "עסק",
      headerClassName: "w-48",
      className: "w-48 max-w-[12rem]",
      render: (charge) => (
        <span className="text-sm font-semibold text-gray-900">
          {charge.business_name ?? `עסק #${charge.business_id}`}
        </span>
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
      headerClassName: "w-40",
      className: "w-40",
      render: (charge) => (
        <span className="text-sm text-gray-500">
          {getChargePeriodLabel(charge.period, charge.months_covered)}
        </span>
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
    return [
      buildSelectionColumn<ChargeResponse>({
        allIds,
        selectedIds,
        onToggleSelect,
        onToggleAll,
        getId: (charge) => charge.id,
        getItemAriaLabel: (charge) => `בחר חיוב ${charge.id}`,
      }),
      ...dataColumns,
    ];
  }

  return dataColumns;
};
