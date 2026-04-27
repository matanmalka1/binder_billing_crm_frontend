import { useQuery } from "@tanstack/react-query";
import { annualReportFinancialsApi } from "../../api";
import { annualReportTaxApi, annualReportsQK } from "../../api";
import { StatsCard } from "../../../../components/ui/layout/StatsCard";
import { formatCurrencyILS as fmt } from "@/utils/utils";
import { SKELETON_CARD_COUNT, SUMMARY_CARD_META } from "./constants";
import { getBalanceDescription, getBalanceVariant } from "./helpers";

interface Props {
  reportId: number;
}

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
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  const fin = financialsQ.data;
  const tax = taxCalcQ.data;
  const adv = advancesQ.data;

  if (!fin || !tax || !adv) return null;

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
        title={SUMMARY_CARD_META.recognizedExpenses.title}
        value={fmt(recognizedExpenses)}
        description={`מתוך ${fmt(grossExpenses)} הוצאות`}
        icon={SUMMARY_CARD_META.recognizedExpenses.icon}
        variant={SUMMARY_CARD_META.recognizedExpenses.variant}
        trend={{ value: expenseRatio, label: "% מהכנסות" }}
      />

      <StatsCard
        title={SUMMARY_CARD_META.advancesPaid.title}
        value={fmt(totalAdvancesPaid)}
        description={getBalanceDescription(adv)}
        icon={SUMMARY_CARD_META.advancesPaid.icon}
        variant={getBalanceVariant(adv.balance_type)}
      />

      <StatsCard
        title={SUMMARY_CARD_META.annualTax.title}
        value={fmt(taxAfterCredits)}
        icon={SUMMARY_CARD_META.annualTax.icon}
        variant={SUMMARY_CARD_META.annualTax.variant}
        trend={{ value: -(tax.effective_rate * 100), label: `${(tax.effective_rate * 100).toFixed(2)}% שיעור אפקטיבי` }}
      />

      <StatsCard
        title={SUMMARY_CARD_META.netProfit.title}
        value={fmt(netProfit)}
        icon={SUMMARY_CARD_META.netProfit.icon}
        variant={SUMMARY_CARD_META.netProfit.variant}
        trend={{ value: profitMargin, label: `${profitMargin.toFixed(1)}% שיעור רווח` }}
      />

      <StatsCard
        title={SUMMARY_CARD_META.grossIncome.title}
        value={fmt(totalIncome)}
        icon={SUMMARY_CARD_META.grossIncome.icon}
        variant={SUMMARY_CARD_META.grossIncome.variant}
      />
    </div>
  );
};
