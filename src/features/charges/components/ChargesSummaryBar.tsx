import { Clock, CheckCircle2, FileText, XCircle } from "lucide-react";
import type { ChargeResponse } from "../api";
import { formatILS } from "../utils";
import { StatsCard } from "@/components/ui/layout/StatsCard";

interface ChargesSummaryBarProps {
  charges: ChargeResponse[];
  isAdvisor: boolean;
  total: number;
}

export const ChargesSummaryBar: React.FC<ChargesSummaryBarProps> = ({ charges, isAdvisor }) => {
  if (charges.length === 0) return null;

  const amountOrCount = (status: string): string => {
    const group = charges.filter((c) => c.status === status);
    if (!isAdvisor) return String(group.length);
    const sum = group.reduce((s, c) => s + parseFloat(c.amount ?? "0"), 0);
    return formatILS(sum);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatsCard
        title="ממתין לגביה"
        value={amountOrCount("issued")}
        icon={Clock}
        variant="blue"
      />
      <StatsCard
        title="שולם"
        value={amountOrCount("paid")}
        icon={CheckCircle2}
        variant="green"
      />
      <StatsCard
        title="טיוטה"
        value={amountOrCount("draft")}
        icon={FileText}
        variant="neutral"
      />
      <StatsCard
        title="בוטל"
        value={amountOrCount("canceled")}
        icon={XCircle}
        variant="red"
      />
    </div>
  );
};

ChargesSummaryBar.displayName = "ChargesSummaryBar";
