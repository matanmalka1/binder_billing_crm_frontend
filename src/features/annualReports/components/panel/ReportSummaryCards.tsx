import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { annualReportFinancialsApi } from "../../api";
import { annualReportTaxApi, annualReportsQK } from "../../api";
import { cn } from "../../../../utils/utils";
import { semanticMonoToneClasses } from "../../../../utils/semanticColors";

interface Props {
  reportId: number;
}

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  subClass?: string;
  colorClass: string;
  trend?: number | null;
  trendLabel?: string;
  extra?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sub,
  subClass,
  colorClass,
  trend,
  trendLabel,
  extra,
}) => {
  const hasTrend = trend != null;
  const isPositive = hasTrend && trend > 0;
  const isNegative = hasTrend && trend < 0;

  return (
    <div className={cn("rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-1 min-w-0", colorClass)}>
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
      {sub && <p className={cn("text-xs truncate", subClass ?? "text-gray-400")}>{sub}</p>}
      {hasTrend && (
        <div className="flex items-center gap-1 mt-0.5">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 shrink-0 text-positive-500" />
          ) : isNegative ? (
            <TrendingDown className="h-3 w-3 shrink-0 text-negative-500" />
          ) : (
            <Minus className="h-3 w-3 text-gray-400 shrink-0" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive
                ? semanticMonoToneClasses.positive
                : isNegative
                  ? "text-negative-500"
                  : "text-gray-400",
            )}
          >
            {trendLabel ?? `${Math.abs(trend!).toFixed(1)}%`}
          </span>
        </div>
      )}
      {extra}
    </div>
  );
};

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
  const profitMargin = totalIncome > 0
    ? ((netProfit / totalIncome) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {/* ניכויים מוכרים */}
      <MetricCard
        label="ניכויים מוכרים"
        value={fmt(recognizedExpenses)}
        sub={`מתוך ${fmt(grossExpenses)} הוצאות`}
        colorClass="border-purple-100"
        trend={null}
        trendLabel={`${((recognizedExpenses / Math.max(totalIncome, 1)) * 100).toFixed(1)}% מהכנסות`}
      />

      {/* מקדמות ששולמו */}
      <MetricCard
        label="מקדמות ששולמו"
        value={fmt(totalAdvancesPaid)}
        sub={balanceSub}
        subClass={balanceIsDue ? "text-negative-500" : balanceIsRefund ? semanticMonoToneClasses.positive : "text-gray-400"}
        colorClass="border-info-100"
        extra={
          <span
            className={cn(
              "mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
              balanceIsDue
                ? "bg-negative-50 text-negative-600"
                : balanceIsRefund
                  ? "bg-positive-50 text-positive-700"
                  : "bg-gray-100 text-gray-500",
            )}
          >
            יתרה
          </span>
        }
      />

      {/* חבות מס שנתית */}
      <MetricCard
        label="חבות מס שנתית"
        value={fmt(taxAfterCredits)}
        sub={`שיעור אפקטיבי`}
        colorClass="border-negative-100"
        trend={-(tax.effective_rate * 100)}
        trendLabel={`${(tax.effective_rate * 100).toFixed(2)}% שיעור אפקטיבי`}
      />

      {/* רווח נקי */}
      <MetricCard
        label="רווח נקי"
        value={fmt(netProfit)}
        colorClass="border-positive-100"
        trend={profitMargin}
        trendLabel={`${profitMargin.toFixed(1)}% שיעור רווח`}
      />

      {/* הכנסות ברוטו */}
      <MetricCard
        label="הכנסות ברוטו"
        value={fmt(totalIncome)}
        colorClass="border-gray-200"
        trend={null}
        trendLabel="סך הכנסות"
      />
    </div>
  );
};
