import { Clock, CheckCircle2, FileText, XCircle } from "lucide-react";
import type { ChargeListStats, ChargeStatusStat } from "../api";
import { formatILS } from "../utils";
import { StatsCard } from "@/components/ui/layout/StatsCard";

interface ChargesSummaryBarProps {
  stats: ChargeListStats;
  isAdvisor: boolean;
  currentStatus: string;
  onStatusClick: (status: string) => void;
}

export const ChargesSummaryBar: React.FC<ChargesSummaryBarProps> = ({
  stats,
  isAdvisor,
  currentStatus,
  onStatusClick,
}) => {
  const display = (stat: ChargeStatusStat): string =>
    isAdvisor ? formatILS(parseFloat(stat.amount)) : String(stat.count);

  const handleClick = (status: string) => {
    onStatusClick(currentStatus === status ? "" : status);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatsCard
        title="ממתין לגביה"
        value={display(stats.issued)}
        icon={Clock}
        variant="blue"
        selected={currentStatus === "issued"}
        onClick={() => handleClick("issued")}
      />
      <StatsCard
        title="שולם"
        value={display(stats.paid)}
        icon={CheckCircle2}
        variant="green"
        selected={currentStatus === "paid"}
        onClick={() => handleClick("paid")}
      />
      <StatsCard
        title="טיוטה"
        value={display(stats.draft)}
        icon={FileText}
        variant="neutral"
        selected={currentStatus === "draft"}
        onClick={() => handleClick("draft")}
      />
      <StatsCard
        title="בוטל"
        value={display(stats.canceled)}
        icon={XCircle}
        variant="red"
        selected={currentStatus === "canceled"}
        onClick={() => handleClick("canceled")}
      />
    </div>
  );
};

ChargesSummaryBar.displayName = "ChargesSummaryBar";
