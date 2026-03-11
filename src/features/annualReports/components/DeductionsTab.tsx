import { useQuery } from "@tanstack/react-query";
import { annualReportFinancialsApi } from "../../../api/annualReportFinancials.api";
import { QK } from "../../../lib/queryKeys";
import { TaxCreditsPanel } from "./TaxCreditsPanel";
import { TaxSavingsOpportunities } from "./TaxSavingsOpportunities";
import { EXPENSE_LABELS } from "../report.constants";

interface Props {
  reportId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const CATEGORY_ICONS: Record<string, string> = {
  office_rent: "🏢",
  professional_services: "💼",
  salaries: "👥",
  depreciation: "📉",
  vehicle: "🚗",
  marketing: "📣",
  insurance: "🛡",
  communication: "📱",
  travel: "✈️",
  training: "🎓",
  bank_fees: "🏦",
  other: "📋",
};

export const DeductionsTab: React.FC<Props> = ({ reportId }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.tax.annualReportFinancials(reportId),
    queryFn: () => annualReportFinancialsApi.getFinancials(reportId),
  });

  if (isLoading)
    return <p className="py-8 text-center text-sm text-gray-400">טוען ניכויים...</p>;

  const expenses = data?.expense_lines ?? [];

  const totalRecognized = expenses.reduce((s, e) => s + e.recognized_amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Left: recognized deductions list */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">ניכויים מוכרים</h3>
            <span className="h-2 w-2 rounded-full bg-red-500" />
          </div>
          <div className="divide-y divide-gray-50">
            {expenses.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">אין ניכויים</p>
            )}
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {CATEGORY_ICONS[e.category] ?? "📋"}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">
                      {EXPENSE_LABELS[e.category] ?? e.category}
                    </p>
                    {e.recognition_rate < 100 && (
                      <p className="text-xs text-gray-400">{e.recognition_rate}% מוכר</p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {fmt(e.recognized_amount)}
                </span>
              </div>
            ))}
          </div>
          {expenses.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-700">סה"כ ניכויים מוכרים</span>
              <span className="text-sm font-bold text-red-700">{fmt(totalRecognized)}</span>
            </div>
          )}
        </div>

        {/* Right: tax credits */}
        <TaxCreditsPanel reportId={reportId} />
      </div>

      {/* Savings opportunities */}
      <TaxSavingsOpportunities />
    </div>
  );
};
