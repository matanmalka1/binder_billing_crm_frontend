import { useQuery } from "@tanstack/react-query";
import { Banknote, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { QK } from "../../lib/queryKeys";
import { advancePaymentsApi } from "../../api/advancePayments.api";
import { StatsCard } from "../ui/StatsCard";

interface AdvancePaymentsKPICardsProps {
  clientId: number;
  year: number;
}

export const AdvancePaymentsKPICards: React.FC<AdvancePaymentsKPICardsProps> = ({
  clientId,
  year,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.tax.advancePayments.kpi(clientId, year),
    queryFn: () => advancePaymentsApi.getAnnualKPIs(clientId, year),
    enabled: clientId > 0 && year > 0,
  });

  if (isLoading || !data) return null;

  const collectionPct = Math.round(data.collection_rate);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatsCard
        title="סה״כ צפוי"
        value={`₪${data.total_expected.toLocaleString("he-IL")}`}
        icon={Banknote}
        variant="blue"
      />
      <StatsCard
        title="סה״כ שולם"
        value={`₪${data.total_paid.toLocaleString("he-IL")}`}
        icon={CheckCircle}
        variant="green"
      />
      <div className="relative rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-200/50 overflow-hidden animate-scale-in">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30 blur-3xl bg-gradient-to-br from-purple-400 to-fuchsia-600" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">שיעור גבייה</h3>
            <div className="rounded-lg p-3 shadow-sm bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-purple-700 mb-3">
            {collectionPct}%
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(collectionPct, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <StatsCard
        title="פיגורים"
        value={data.overdue_count}
        icon={AlertCircle}
        variant={data.overdue_count > 0 ? "red" : "green"}
      />
    </div>
  );
};

AdvancePaymentsKPICards.displayName = "AdvancePaymentsKPICards";
