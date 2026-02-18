import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { formatDateTime, cn } from "../../../utils/utils";
import { getChargeAmountText, canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import type { ChargeResponse } from "../../../api/charges.api";
import { getChargeStatusLabel } from "../../../utils/enums";
import { staggerDelay } from "../../../utils/animation";

const chargeStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};

interface ChargeRowProps {
  charge: ChargeResponse;
  index: number;
  actionLoadingId: number | null;
  isAdvisor: boolean;
  onRunAction: (chargeId: number, action: "issue" | "markPaid" | "cancel") => Promise<void>;
}

export const ChargeRow = ({
  charge,
  index,
  actionLoadingId,
  isAdvisor,
  onRunAction,
}: ChargeRowProps) => {
  const isLoading = actionLoadingId === charge.id;
  const isDisabled = actionLoadingId !== null && actionLoadingId !== charge.id;

  const handleIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    void onRunAction(charge.id, "issue");
  };

  const handleMarkPaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    void onRunAction(charge.id, "markPaid");
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    void onRunAction(charge.id, "cancel");
  };

  return (
    <tr
      className={cn(
        "group transition-colors hover:bg-gray-50 animate-fade-in"
      )}
      style={{ animationDelay: staggerDelay(index) }}
    >
      {/* ID */}
      <td className="py-3.5 pr-6">
        <span className="font-mono text-sm font-semibold text-gray-900">
          #{charge.id}
        </span>
      </td>

      {/* Client */}
      <td className="py-3.5 pr-4">
        <span className="font-mono text-sm text-gray-700">
          #{charge.client_id}
        </span>
      </td>

      {/* Type */}
      <td className="py-3.5 pr-4">
        <span className="text-sm text-gray-700">{charge.charge_type}</span>
      </td>

      {/* Status */}
      <td className="py-3.5 pr-4">
        <StatusBadge
          status={charge.status}
          getLabel={getChargeStatusLabel}
          variantMap={chargeStatusVariants}
        />
      </td>

      {/* Amount */}
      <td className="py-3.5 pr-4">
        <span className="font-mono text-sm font-semibold text-gray-900 tabular-nums">
          {getChargeAmountText(charge)}
        </span>
      </td>

      {/* Created */}
      <td className="py-3.5 pr-4">
        <span className="text-sm text-gray-500 tabular-nums">
          {formatDateTime(charge.created_at)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to={`/charges/${charge.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
          >
            פירוט
            <ExternalLink className="h-3 w-3" />
          </Link>

          {isAdvisor && canIssue(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isLoading}
              disabled={isDisabled}
              onClick={handleIssue}
            >
              הנפקה
            </Button>
          )}

          {isAdvisor && canMarkPaid(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isLoading}
              disabled={isDisabled}
              onClick={handleMarkPaid}
            >
              סימון שולם
            </Button>
          )}

          {isAdvisor && canCancel(charge.status) && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isLoading}
              disabled={isDisabled}
              onClick={handleCancel}
            >
              ביטול
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

ChargeRow.displayName = "ChargeRow";
