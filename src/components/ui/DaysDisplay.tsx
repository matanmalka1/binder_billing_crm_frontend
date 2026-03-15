import { cn } from "../../utils/utils";

interface DaysDisplayProps {
  days: number | null | undefined;
  returned?: boolean;
  className?: string;
}

export const DaysDisplay: React.FC<DaysDisplayProps> = ({ days, returned, className }) => {
  if (days == null) return <span className="text-gray-400">—</span>;

  const urgency = returned
    ? "text-gray-400"
    : days > 90
      ? "text-red-600 font-bold"
      : days > 60
        ? "text-orange-500 font-semibold"
        : "text-gray-700";

  return (
    <span className={cn("font-mono text-sm tabular-nums", urgency, className)}>
      {days}
    </span>
  );
};

DaysDisplay.displayName = "DaysDisplay";
