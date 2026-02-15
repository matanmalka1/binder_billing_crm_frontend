import { Badge } from "../../../components/ui/Badge";

const variantMap: Record<string, "neutral" | "info" | "success" | "error"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};

const labels: Record<string, string> = {
  draft: "טיוטה",
  issued: "הונפק",
  paid: "שולם",
  canceled: "בוטל",
};

export const ChargeStatusBadge = ({ status }: { status: string }) => {
  const variant = variantMap[status] ?? "neutral";
  const label = labels[status] || "—";

  return <Badge variant={variant}>{label}</Badge>;
};
