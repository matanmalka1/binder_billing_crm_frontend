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
        value={fmtCurrency(Math.abs(balance))}
        icon={AlertCircle}
        variant={balance > 0 ? "orange" : balance < 0 ? "blue" : "green"}
        description={balance > 0 ? "נותר לתשלום" : balance < 0 ? "שולם ביתר" : "הכל שולם"}
      />
    </div>
  );
};