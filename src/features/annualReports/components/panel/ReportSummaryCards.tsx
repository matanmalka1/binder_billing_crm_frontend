import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Banknote, Receipt, PiggyBank } from "lucide-react";
import { annualReportFinancialsApi } from "../../api";
import { annualReportTaxApi, annualReportsQK } from "../../api";
import { StatsCard } from "../../../../components/ui/layout/StatsCard";

interface Props {
  reportId: number;
}

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

export const ReportSummaryCards: React.FC<Props> = ({ reportId }) => {
  const financialsQ = useQuery({
    queryKey: annualReportsQK.financials(reportId),
    queryFn: () => annualReportFinancialsApi.getFinancials(reportId),
    enabled: !!reportId,
  });

  const taxCalcQ = useQuery({
    queryKey: annualReportsQK.taxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
    enabled: !!reportId,
  });

  const advancesQ = useQuery({
    queryKey: annualReportsQK.advancesSummary(reportId),
    queryFn: () => annualReportTaxApi.getAdvancesSummary(reportId),
    enabled: !!reportId,
  });

  const isLoading =
    financialsQ.isLoading || taxCalcQ.isLoading || advancesQ.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  const fin = financialsQ.data;
  const tax = taxCalcQ.data;
  const adv = advancesQ.data;

  if (!fin || !tax || !adv) return null;

  const balanceIsDue = adv.balance_type === "due";
  const balanceIsRefund = adv.balance_type === "refund";
  const absBalance = Math.abs(Number(adv.final_balance));
  const balanceSub = balanceIsDue
    ? `יתרה: ₪${absBalance.toLocaleString("he-IL")} לתשלום`
    : balanceIsRefund
      ? `יתרה: ₪${absBalance.toLocaleString("he-IL")} החזר`
      : "מאוזן";

  const totalIncome = Number(fin.total_income);
  const recognizedExpenses = Number(fin.recognized_expenses);
  const grossExpenses = Number(fin.gross_expenses);
  const netProfit = Number(tax.net_profit);
  const taxAfterCredits = Number(tax.tax_after_credits);
  const totalAdvancesPaid = Number(adv.total_advances_paid);
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const expenseRatio = totalIncome > 0 ? (recognizedExpenses / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatsCard
        title="ניכויים מוכרים"
        value={fmt(recognizedExpenses)}
        description={`מתוך ${fmt(grossExpenses)} הוצאות`}
        icon={Receipt}
        variant="purple"
        trend={{ value: expenseRatio, label: "% מהכנסות" }}
      />

      <StatsCard
        title="מקדמות ששולמו"
        value={fmt(totalAdvancesPaid)}
        description={balanceSub}
        icon={PiggyBank}
        variant={balanceIsDue ? "red" : balanceIsRefund ? "green" : "neutral"}
      />

      <StatsCard
        title="חבות מס שנתית"
        value={fmt(taxAfterCredits)}
        icon={TrendingDown}
        variant="red"
        trend={{ value: -(tax.effective_rate * 100), label: `${(tax.effective_rate * 100).toFixed(2)}% שיעור אפקטיבי` }}
      />

      <StatsCard
        title="רווח נקי"
        value={fmt(netProfit)}
        icon={TrendingUp}
        variant="green"
        trend={{ value: profitMargin, label: `${profitMargin.toFixed(1)}% שיעור רווח` }}
      />

      <StatsCard
        title="הכנסות ברוטו"
        value={fmt(totalIncome)}
        icon={Banknote}
        variant="neutral"
      />
    </div>
  );
};
