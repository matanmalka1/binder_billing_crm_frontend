import { TrendingUp, Banknote, CheckCircle } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import { fmtCurrency } from "../utils";

interface OverviewKPICardsProps {
  year: number;
  totalExpected: number | null;
  totalPaid: number | null;
  collectionRate: number | null;
}

export const OverviewKPICards: React.FC<OverviewKPICardsProps> = ({
  year,
  totalExpected,
  totalPaid,
  collectionRate,
}) => {
  const pct = collectionRate !== null ? Math.min(Math.round(collectionRate), 100) : null;

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
      <div className="relative rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-200/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl bg-gradient-to-br from-purple-400 to-fuchsia-600" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">שיעור גבייה</h3>
            <div className="rounded-lg p-2 bg-purple-100 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-purple-700 mb-3">
            {pct !== null ? `${pct}%` : "—"}
          </div>
          {pct !== null && (
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OverviewKPICards.displayName = "OverviewKPICards";
