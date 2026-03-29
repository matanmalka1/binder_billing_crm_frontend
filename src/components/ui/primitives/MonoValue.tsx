import { cn } from "../../../utils/utils";

interface MonoValueProps {
  value: string | number | null | undefined;
  tone?: "neutral" | "positive" | "negative" | "warning" | "critical";
  /** Days mode: derives tone from urgency thresholds (60/90 days) */
  format?: "amount" | "days";
  /** Days mode: forces neutral tone regardless of value */
  returned?: boolean;
  className?: string;
}

const toneClass: Record<NonNullable<MonoValueProps["tone"]>, string> = {
  neutral: "text-gray-700",
  positive: "text-green-700",
  negative: "text-red-600",
  warning: "text-orange-500 font-semibold",
  critical: "text-red-600 font-bold",
};

const daysTone = (
  days: number,
  returned?: boolean,
): NonNullable<MonoValueProps["tone"]> => {
  if (returned) return "neutral";
  if (days > 90) return "critical";
  if (days > 60) return "warning";
  return "neutral";
};

export const MonoValue: React.FC<MonoValueProps> = ({
  value,
  tone = "neutral",
  format,
  returned,
  className,
}) => {
  if (value == null) return <span className="text-gray-400">—</span>;

  const resolvedTone =
    format === "days" && typeof value === "number"
      ? daysTone(value, returned)
      : tone;

  return (
    <span
      className={cn(
        "font-mono text-sm tabular-nums",
        format !== "days" && "font-medium",
        toneClass[resolvedTone],
        className,
      )}
    >
      {value}
    </span>
  );
};

MonoValue.displayName = "MonoValue";
