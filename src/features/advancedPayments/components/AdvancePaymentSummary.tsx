import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";

interface Props {
  totalExpected: number;
  totalPaid: number;
}

const fmt = (n: number) => `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;

export const AdvancePaymentSummary: React.FC<Props> = ({ totalExpected, totalPaid }) => {
  const balance = totalExpected - totalPaid;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="סה״כ צפוי"
        value={fmt(totalExpected)}
        icon={DollarSign}
        variant="blue"
        description="סכום מקדמות מתוכנן לשנה"
      />
      <StatsCard
        title="שולם בפועל"
        value={fmt(totalPaid)}
        icon={CheckCircle}
        variant="green"
        description="סה״כ מקדמות ששולמו"
      />
      <StatsCard
        title="יתרה לתשלום"
        value={fmt(balance)}
        icon={AlertCircle}
        variant={balance > 0 ? "orange" : "green"}
        description={balance > 0 ? "נותר לתשלום" : "הכל שולם"}
      />
    </div>
  );
};
