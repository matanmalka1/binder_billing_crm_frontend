import { type RefObject } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ChargeResponse } from "../../../api/charges.api";
import { getChargeAmountText, canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

export type ChargeAction = "issue" | "markPaid" | "cancel";

interface BuildChargeColumnsParams {
  isAdvisor: boolean;
  actionLoadingIdRef: RefObject<number | null>;
  runAction: (chargeId: number, action: ChargeAction) => Promise<void>;
}

export const buildChargeColumns = ({
  isAdvisor,
  actionLoadingIdRef,
  runAction,
}: BuildChargeColumnsParams): Column<ChargeResponse>[] => [
  {
    key: "id",
    header: "מזהה",
    render: (charge) => (
      <span className="font-medium text-gray-900">#{charge.id}</span>
    ),
  },
  {
    key: "client_id",
    header: "לקוח",
    render: (charge) => (
      <span className="text-gray-700">#{charge.client_id}</span>
    ),
  },
  {
    key: "charge_type",
    header: "סוג",
    render: (charge) => {
      const labels: Record<string, string> = {
        one_time: "חד פעמי",
        retainer: "ריטיינר",
      };
      return (
        <span className="text-gray-700">{labels[charge.charge_type] || charge.charge_type}</span>
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
        variantMap={{
          draft: "neutral",
          issued: "info",
          paid: "success",
          canceled: "error",
        }}
      />
    ),
  },
  {
    key: "amount",
    header: "סכום",
    render: (charge) => (
      <span className="font-medium text-gray-900">{getChargeAmountText(charge)}</span>
    ),
  },
  {
    key: "created_at",
    header: "נוצר",
    render: (charge) => (
      <span className="text-sm text-gray-600">{formatDateTime(charge.created_at)}</span>
    ),
  },
  {
    key: "actions",
    header: "פעולות",
    render: (charge) => {
      const loadingAction = actionLoadingIdRef.current === charge.id;

      return (
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/charges/${charge.id}`}
            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            פירוט
          </Link>

          {isAdvisor && canIssue(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={loadingAction}
              disabled={loadingAction}
              onClick={(e) => {
                e.stopPropagation();
                void runAction(charge.id, "issue");
              }}
            >
              הנפקה
            </Button>
          )}

          {isAdvisor && canMarkPaid(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={loadingAction}
              disabled={loadingAction}
              onClick={(e) => {
                e.stopPropagation();
                void runAction(charge.id, "markPaid");
              }}
            >
              סימון שולם
            </Button>
          )}

          {isAdvisor && canCancel(charge.status) && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={loadingAction}
              disabled={loadingAction}
              onClick={(e) => {
                e.stopPropagation();
                void runAction(charge.id, "cancel");
              }}
            >
              ביטול
            </Button>
          )}
        </div>
      );
    },
  },
];
