import { useQuery } from "@tanstack/react-query";
import { Banknote, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import { StatsCard } from "../../../components/ui/layout/StatsCard";
import { fmtCurrency } from "../utils";
import { getCollectionPercent } from "./advancePaymentComponent.utils";

interface AdvancePaymentsKPICardsProps {
  clientId: number;
  year: number;
}

export const AdvancePaymentsKPICards: React.FC<AdvancePaymentsKPICardsProps> = ({
  clientId,
  year,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: advancedPaymentsQK.kpi(clientId, year),
    queryFn: () => advancePaymentsApi.getAnnualKPIs(clientId, year),
    enabled: clientId > 0 && year > 0,
  });

  if (isLoading || !data) return null;

  const collectionPct = getCollectionPercent(data.collection_rate) ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatsCard
        title="סה״כ צפוי"
        value={fmtCurrency(data.total_expected)}
        icon={Banknote}
        variant="blue"
      />
      <StatsCard
        title="סה״כ שולם"
        value={fmtCurrency(data.total_paid)}
        icon={CheckCircle}
        variant="green"
      />
      <StatsCard
        title="שיעור גבייה"
        value={`${collectionPct}%`}
        icon={TrendingUp}
        variant="purple"
        progress={collectionPct}
      />
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
