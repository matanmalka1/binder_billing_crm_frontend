import { Bell, Calendar } from "lucide-react";
import { StatsCard } from "../../../components/ui/layout/StatsCard";
import { cn } from "../../../utils/utils";

interface RemindersSummaryCardsProps {
  pendingCount: number;
  sentCount: number;
  activeFilter?: string;
  onFilter?: (status: string) => void;
}

export const RemindersSummaryCards: React.FC<RemindersSummaryCardsProps> = ({
  pendingCount,
  sentCount,
  activeFilter,
  onFilter,
}) => {
  const stats = [
    {
      icon: Bell,
      variant: "blue" as const,
      count: pendingCount,
      label: "תזכורות ממתינות",
      filterValue: "pending",
    },
    {
      icon: Calendar,
      variant: "green" as const,
      count: sentCount,
      label: "תזכורות שנשלחו",
      filterValue: "sent",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map(({ icon, variant, count, label, filterValue }) => {
        const isActive = activeFilter === filterValue && filterValue !== "";
        return (
          <button
            key={label}
            type="button"
            onClick={onFilter ? () => onFilter(isActive ? "" : filterValue) : undefined}
            className={cn(
              "text-right transition-transform",
              onFilter ? "cursor-pointer hover:scale-[1.01]" : "cursor-default",
              isActive && "scale-[1.01]",
            )}
            disabled={!onFilter}
          >
            <StatsCard
              title={label}
              value={count}
              icon={icon}
              variant={variant}
              className={cn(
                "h-full w-full",
                isActive ? "ring-2 ring-primary-300 ring-offset-2" : "ring-1 ring-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
