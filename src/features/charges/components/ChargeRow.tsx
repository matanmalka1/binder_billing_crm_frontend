import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ExternalLink } from "lucide-react";
import { formatDateTime } from "../../../utils/utils";
import { getChargeAmountText, canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import type { ChargeResponse } from "../../../api/charges.api";
import { cn } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

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

export const ChargeRow: React.FC<ChargeRowProps> = ({
  charge,
  index,
  actionLoadingId,
  isAdvisor,
  onRunAction,
}) => {
  const loadingAction = actionLoadingId === charge.id;

  return (
    <tr 
      className={cn(
        "group transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <td className="py-4 pr-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-accent-400 to-accent-600 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="font-mono text-sm font-semibold text-gray-900">
            #{charge.id}
          </span>
        </div>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">לקוח #{charge.client_id}</span>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">{charge.charge_type}</span>
      </td>

      <td className="py-4 pr-4">
        <StatusBadge
          status={charge.status}
          getLabel={getChargeStatusLabel}
          variantMap={chargeStatusVariants}
        />
      </td>

      <td className="py-4 pr-4">
        <span className="font-mono text-sm font-semibold text-gray-900">
          {getChargeAmountText(charge)}
        </span>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-600">{formatDateTime(charge.created_at)}</span>
      </td>

      <td className="py-4 pr-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/charges/${charge.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg",
              "border border-gray-300 px-3 py-1.5 text-sm",
              "text-gray-700 transition-all duration-200",
              "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900",
              "hover:shadow-sm hover:-translate-y-0.5"
            )}
          >
            פירוט
            <ExternalLink className="h-3 w-3" />
          </Link>

          {isAdvisor && canIssue(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={loadingAction}
              disabled={loadingAction}
              onClick={() => onRunAction(charge.id, "issue")}
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
              onClick={() => onRunAction(charge.id, "markPaid")}
            >
              סימון שולם
            </Button>
          )}
          {isAdvisor && canCancel(charge.status) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={loadingAction}
              disabled={loadingAction}
              onClick={() => onRunAction(charge.id, "cancel")}
            >
              ביטול
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
