import { Badge } from "../../../components/ui/Badge";
import { getAdvancePaymentStatusLabel } from "../../../utils/enums";
import type { AdvancePaymentStatus } from "../types";
import { STATUS_VARIANT } from "../utils";

interface AdvancePaymentStatusBadgeProps {
  status: AdvancePaymentStatus;
}

export const AdvancePaymentStatusBadge: React.FC<AdvancePaymentStatusBadgeProps> = ({
  status,
}) => (
  <Badge variant={STATUS_VARIANT[status] ?? "neutral"}>
    {getAdvancePaymentStatusLabel(status)}
  </Badge>
);

AdvancePaymentStatusBadge.displayName = "AdvancePaymentStatusBadge";
