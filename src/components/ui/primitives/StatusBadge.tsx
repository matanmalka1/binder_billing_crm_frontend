import { Badge } from "./Badge";

type Variant = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  status: string;
  getLabel: (status: string) => string;
  variantMap: Record<string, Variant>;
  defaultVariant?: Variant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  getLabel,
  variantMap,
  defaultVariant = "neutral",
}) => {
  const label = getLabel(status);
  const variant = variantMap[status] ?? defaultVariant;
  return <Badge variant={variant}>{label}</Badge>;
};
