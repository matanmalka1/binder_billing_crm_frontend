import {
  Percent,
  TrendingUp,
  Banknote,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import { fmtCurrency } from "../utils";

interface AdvancePaymentsStatsRowProps {
  advanceRate: number | null;
  annualIncome: number | null;
  totalExpected: number;
  totalPaid: number;
}

export const AdvancePaymentsStatsRow: React.FC<
  AdvancePaymentsStatsRowProps
> = ({ advanceRate, annualIncome, totalExpected, totalPaid }) => {
  const balance = totalExpected - totalPaid;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatsCard
        title="שיעור מקדמה"
        value={advanceRate != null ? `${advanceRate}%` : "—"}
        icon={Percent}
        variant="purple"
      />
      <StatsCard
        title="הכנסה שנתית משוערת"
        value={
          annualIncome != null ? fmtCurrency(Math.round(annualIncome)) : "—"
        }
        icon={TrendingUp}
        variant="blue"
      />
      <StatsCard
        title="מס שנתי צפוי"
        value={fmtCurrency(totalExpected)}
        icon={Banknote}
        variant="blue"
        description="סכום מקדמות מתוכנן"
      />
      <StatsCard
        title="שולם"
        value={fmtCurrency(totalPaid)}
        icon={CheckCircle}
        variant="green"
      />
      <StatsCard
        title="יתרה"
        value={fmtCurrency(Math.abs(balance))}
        icon={AlertCircle}
        variant={balance > 0 ? "orange" : balance < 0 ? "blue" : "green"}
        description={
          balance > 0 ? "נותר לתשלום" : balance < 0 ? "שולם ביתר" : "הכל שולם"
        }
      />
    </div>
  );
};

AdvancePaymentsStatsRow.displayName = "AdvancePaymentsStatsRow";
