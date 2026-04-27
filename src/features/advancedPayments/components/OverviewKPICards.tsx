import { TrendingUp, Banknote, CheckCircle } from "lucide-react";
import { StatsCard } from "../../../components/ui/layout/StatsCard";
import { fmtCurrency } from "../utils";
import { getCollectionPercent } from "./advancePaymentComponent.utils";

interface OverviewKPICardsProps {
  year: number;
  totalExpected: string | number | null;
  totalPaid: string | number | null;
  collectionRate: number | null;
}

export const OverviewKPICards: React.FC<OverviewKPICardsProps> = ({
  year,
  totalExpected,
  totalPaid,
  collectionRate,
}) => {
  const pct = getCollectionPercent(collectionRate, true);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatsCard
        title="סה״כ צפוי"
        value={fmtCurrency(totalExpected)}
        icon={Banknote}
        variant="blue"
        description={`שנת ${year}`}
      />
      <StatsCard
        title="סה״כ שולם"
        value={fmtCurrency(totalPaid)}
        icon={CheckCircle}
        variant="green"
        description="לפי הסינון הנבחר"
      />
      <StatsCard
        title="שיעור גבייה"
        value={pct !== null ? `${pct}%` : "—"}
        icon={TrendingUp}
        variant="purple"
        progress={pct ?? undefined}
      />
    </div>
  );
};

OverviewKPICards.displayName = "OverviewKPICards";
