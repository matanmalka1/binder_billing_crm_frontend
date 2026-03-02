import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import { fmtCurrency } from "../utils";

interface AdvancePaymentSummaryProps {
  totalExpected: number;
  totalPaid: number;
}

export const AdvancePaymentSummary: React.FC<AdvancePaymentSummaryProps> = ({
  totalExpected,
  totalPaid,
}) => {
  const balance = totalExpected - totalPaid;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="סה״כ צפוי"
        value={fmtCurrency(totalExpected)}
        icon={DollarSign}
        variant="blue"
        description="סכום מקדמות מתוכנן לשנה"
      />
      <StatsCard
        title="שולם בפועל"
        value={fmtCurrency(totalPaid)}
        icon={CheckCircle}
        variant="green"
        description="סה״כ מקדמות ששולמו"
      />
      <StatsCard
        title="יתרה לתשלום"
        value={fmtCurrency(balance)}
        icon={AlertCircle}
        variant={balance > 0 ? "orange" : "green"}
        description={balance > 0 ? "נותר לתשלום" : "הכל שולם"}
      />
    </div>
  );
};