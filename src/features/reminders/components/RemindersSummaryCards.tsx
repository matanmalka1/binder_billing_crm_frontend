import { Bell, Calendar } from "lucide-react";
import { StatsCard } from "../../../components/ui/layout/StatsCard";

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
          <StatsCard
            key={label}
            title={label}
            value={count}
            icon={icon}
            variant={variant}
            onClick={onFilter ? () => onFilter(isActive ? "" : filterValue) : undefined}
            selected={isActive}
            className="h-full w-full"
          />
        );
      })}
    </div>
  );
};
