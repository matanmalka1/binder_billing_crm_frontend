import { Link } from "react-router-dom";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ChargeResponse } from "../../../api/charges.api";
import { getChargeAmountText, getChargeTypeLabel } from "../utils/chargeStatus";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";
import { ChargeActionButtons } from "./ChargeActionButtons"

export type ChargeAction = "issue" | "markPaid" | "cancel";

const chargeStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};

interface BuildChargeColumnsParams {
  isAdvisor: boolean;
  actionLoadingId: number | null;
  runAction: (chargeId: number, action: ChargeAction) => Promise<void>;
  onOpenDetail: (chargeId: number) => void;
}

export const buildChargeColumns = ({
  isAdvisor,
  actionLoadingId,
  runAction,
  onOpenDetail,
}: BuildChargeColumnsParams): Column<ChargeResponse>[] => [
  {
    key: "id",
    header: "מזהה",
    render: (charge) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">#{charge.id}</span>
    ),
  },
  {
    key: "client_id",
    header: "לקוח",
    render: (charge) => (
      <Link
        to={`/clients/${charge.client_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-semibold text-gray-900 hover:text-blue-700 hover:underline"
      >
        {charge.client_name ?? `#${charge.client_id}`}
      </Link>
    ),
  },
  {
    key: "charge_type",
    header: "סוג",
    render: (charge) => (
      <span className="text-sm text-gray-600">{getChargeTypeLabel(charge.charge_type)}</span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
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
    render: (charge) => (
      <span className="font-mono text-sm font-semibold text-gray-900 tabular-nums">
        {getChargeAmountText(charge)}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "נוצר",
    render: (charge) => (
      <span className="text-sm text-gray-500 tabular-nums">{formatDateTime(charge.created_at)}</span>
    ),
  },
  {
    key: "actions",
    header: "פעולות",
    render: (charge) => {
      const isLoading = actionLoadingId === charge.id;
      const isDisabled = actionLoadingId !== null && actionLoadingId !== charge.id;
      const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); fn(); };

      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={stop(() => onOpenDetail(charge.id))}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            פירוט
          </button>
          {isAdvisor && (
            <ChargeActionButtons
              status={charge.status}
              disabled={isLoading || isDisabled}
              onIssue={stop(() => void runAction(charge.id, "issue"))}
              onMarkPaid={stop(() => void runAction(charge.id, "markPaid"))}
              onCancel={stop(() => void runAction(charge.id, "cancel"))}
            />
          )}
        </div>
      );
    },
  },
];