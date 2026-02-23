import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ChargeResponse } from "../../../api/charges.api";
import { getChargeAmountText, canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

export type ChargeAction = "issue" | "markPaid" | "cancel";

/* ─── Variant map ────────────────────────────────────────────── */

const chargeStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};

/* ─── Action cell ────────────────────────────────────────────── */

interface ActionCellProps {
  charge: ChargeResponse;
  isAdvisor: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (chargeId: number, action: ChargeAction) => Promise<void>;
}

const ActionCell: React.FC<ActionCellProps> = ({
  charge,
  isAdvisor,
  isLoading,
  isDisabled,
  runAction,
}) => {
  const handleIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    void runAction(charge.id, "issue");
  };

  const handleMarkPaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    void runAction(charge.id, "markPaid");
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    void runAction(charge.id, "cancel");
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link
        to={`/charges/${charge.id}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      >
        פירוט
        <ExternalLink className="h-3 w-3" />
      </Link>

      {isAdvisor && canIssue(charge.status) && (
        <button
          type="button"
          disabled={isLoading || isDisabled}
          title="מנפיק את החשבונית וממיר אותה מטיוטה לפעיל"
          onClick={handleIssue}
          className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          הנפקה
        </button>
      )}

      {isAdvisor && canMarkPaid(charge.status) && (
        <button
          type="button"
          disabled={isLoading || isDisabled}
          title="מסמן את החשבונית כשולמה על ידי הלקוח"
          onClick={handleMarkPaid}
          className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          סימון שולם
        </button>
      )}

      {isAdvisor && canCancel(charge.status) && (
        <button
          type="button"
          disabled={isLoading || isDisabled}
          title="מבטל את החשבונית לצמיתות — לא ניתן לבטל פעולה זו"
          onClick={handleCancel}
          className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ביטול
        </button>
      )}
    </div>
  );
};
ActionCell.displayName = "ActionCell";

/* ─── Column builder ─────────────────────────────────────────── */

interface BuildChargeColumnsParams {
  isAdvisor: boolean;
  actionLoadingId: number | null;
  runAction: (chargeId: number, action: ChargeAction) => Promise<void>;
}

export const buildChargeColumns = ({
  isAdvisor,
  actionLoadingId,
  runAction,
}: BuildChargeColumnsParams): Column<ChargeResponse>[] => [
  {
    key: "id",
    header: "מזהה",
    render: (charge) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">
        #{charge.id}
      </span>
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
    render: (charge) => {
      const typeLabels: Record<string, string> = {
        one_time: "חד פעמי",
        retainer: "ריטיינר",
      };
      return (
        <span className="text-sm text-gray-600">
          {typeLabels[charge.charge_type] ?? charge.charge_type}
        </span>
      );
    },
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
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDateTime(charge.created_at)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "פעולות",
    render: (charge) => (
      <ActionCell
        charge={charge}
        isAdvisor={isAdvisor}
        isLoading={actionLoadingId === charge.id}
        isDisabled={actionLoadingId !== null && actionLoadingId !== charge.id}
        runAction={runAction}
      />
    ),
  },
];