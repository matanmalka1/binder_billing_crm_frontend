import { Badge } from "../../../components/ui/Badge";
import type { SignatureRequestStatus } from "../../../api/signatureRequests.api";
import { getSignatureRequestStatusLabel } from "../../../utils/enums";

const VARIANT_MAP: Record<
  SignatureRequestStatus,
  "neutral" | "info" | "warning" | "success" | "error"
> = {
  draft: "neutral",
  pending_signature: "info",
  signed: "success",
  declined: "error",
  expired: "warning",
  canceled: "neutral",
};

interface Props {
  status: SignatureRequestStatus;
}

export const SignatureStatusBadge: React.FC<Props> = ({ status }) => (
  <Badge variant={VARIANT_MAP[status] ?? "neutral"}>
    {getSignatureRequestStatusLabel(status)}
  </Badge>
);
