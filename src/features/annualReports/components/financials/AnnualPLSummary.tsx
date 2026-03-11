import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { annualReportFinancialsApi } from "../../../../api/annualReport.financials.api";
import { annualReportTaxApi } from "../../../../api/annualReport.tax.api";
import { annualReportsApi } from "../../../../api/annualReport.api";
import { QK } from "../../../../lib/queryKeys";
import { DrawerSection } from "../../../../components/ui/DetailDrawer";

interface Props {
  reportId: number;
  clientId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

interface WaterfallRowProps {
  label: string;
  value: number;
  isSubtract?: boolean;
  isResult?: boolean;
  highlight?: boolean;
}

const WaterfallRow: React.FC<WaterfallRowProps> = ({ label, value, isSubtract, isResult, highlight }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 text-sm ${
      highlight
        ? "rounded-md bg-amber-50 font-bold text-amber-900"
        : isResult
          ? "rounded-md bg-gray-100 font-semibold text-gray-900"
          : "border-b border-gray-100 text-gray-700"
    }`}
  >
    <span className={isSubtract ? "text-red-600" : ""}>{label}</span>
    <span className={isSubtract ? "text-red-600" : highlight ? "text-amber-700" : ""}>{fmt(value)}</span>
  </div>
);

export const AnnualPLSummary: React.FC<Props> = ({ reportId, clientId }) => {
  const financialsQ = useQuery({
    queryKey: QK.tax.annualReportFinancials(reportId),
    queryFn: () => annualReportFinancialsApi.getFinancials(reportId),
  });

  const taxQ = useQuery({
    queryKey: QK.tax.annualReportTaxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
  });

  const isLoading = financialsQ.isLoading || taxQ.isLoading;
  if (isLoading) return <p className="text-sm text-gray-400 px-3">טוען סיכום רווח והפסד...</p>;
  if (!financialsQ.data || !taxQ.data) return null;

  const fin = financialsQ.data;
  const tax = taxQ.data;

  const grossIncome = fin.total_income;
  const expenses = fin.recognized_expenses;
  const profitBeforeTax = grossIncome - expenses;
  const taxAmount = tax.tax_after_credits;
  const netProfitAfterTax = profitBeforeTax - taxAmount;
  const grossMargin = grossIncome > 0 ? (profitBeforeTax / grossIncome) : 0;

  return (
    <DrawerSection title="סיכום רווח והפסד">
      <div className="space-y-4 py-2">
        {/* P&L Waterfall */}
        <div className="space-y-0.5">
          <WaterfallRow label="הכנסות ברוטו" value={grossIncome} />
          <WaterfallRow label="פחות: הוצאות מוכרות" value={expenses} isSubtract />
          <WaterfallRow label="רווח לפני מס" value={profitBeforeTax} isResult />
          <WaterfallRow label="פחות: מס הכנסה" value={taxAmount} isSubtract />
          <WaterfallRow label="רווח נקי אחרי מס" value={netProfitAfterTax} highlight />
        </div>

        {/* Gross margin progress bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>שיעור רווח גולמי</span>
            <span className="font-semibold text-gray-700">{pct(grossMargin)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-amber-500 transition-all"
              style={{ width: `${Math.min(Math.max(grossMargin * 100, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Multi-year trend chart */}
        {clientId && (
          <MultiYearChart clientId={clientId} currentReportId={reportId} />
        )}
      </div>
    </DrawerSection>
  );
};

interface MultiYearChartProps {
  clientId: number;
  currentReportId: number;
}

const MultiYearChart: React.FC<MultiYearChartProps> = ({ clientId, currentReportId }) => {
  const reportsQ = useQuery({
    queryKey: QK.tax.annualReportsForClient(clientId),
    queryFn: () => annualReportsApi.listClientReports(clientId),
  });

  const reports = reportsQ.data ?? [];
  const sorted = [...reports].sort((a, b) => a.tax_year - b.tax_year).slice(-4);

  const financialsQueries = sorted.map((r) => ({
    id: r.id,
    year: r.tax_year,
    isCurrent: r.id === currentReportId,
  }));

  const finResults = financialsQueries.map((r) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: QK.tax.annualReportFinancials(r.id),
      queryFn: () => annualReportFinancialsApi.getFinancials(r.id),
      enabled: sorted.length > 0,
    })
  );

  const taxResults = financialsQueries.map((r) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: QK.tax.annualReportTaxCalc(r.id),
      queryFn: () => annualReportTaxApi.getTaxCalculation(r.id),
      enabled: sorted.length > 0,
    })
  );

  if (sorted.length < 2) return null;

  const chartData = financialsQueries.map((r, i) => {
    const fin = finResults[i].data;
    const tax = taxResults[i].data;
    if (!fin || !tax) return null;
    const income = fin.total_income;
    const expenses = fin.recognized_expenses;
    const profit = income - expenses;
    const taxAmt = tax.tax_after_credits;
    return { שנה: r.year, הכנסות: income, הוצאות: expenses, רווח: profit, מס: taxAmt };
  }).filter(Boolean) as { שנה: number; הכנסות: number; הוצאות: number; רווח: number; מס: number }[];

  if (chartData.length < 2) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        מגמה רב-שנתית
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <XAxis dataKey="שנה" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 10 }}
            width={52}
          />
          <Tooltip
            formatter={(value) => fmt(Number(value))}
            labelFormatter={(label) => `שנת מס ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="הכנסות" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="הוצאות" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="רווח" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="מס" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
