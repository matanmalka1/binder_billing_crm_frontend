import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";

interface Props {
  reportId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

export const TaxCalculationPanel: React.FC<Props> = ({ reportId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QK.tax.annualReportTaxCalc(reportId),
    queryFn: () => annualReportsApi.getTaxCalculation(reportId),
  });

  if (isLoading) return <p className="text-sm text-gray-400">מחשב מס...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">שגיאה בטעינת חישוב מס</p>;

  const rows: { label: string; value: string }[] = [
    { label: "הכנסה חייבת", value: fmt(data.taxable_income) },
    { label: "מס לפני זיכויים", value: fmt(data.tax_before_credits) },
    { label: "שווי נקודות זיכוי", value: fmt(data.credit_points_value) },
    { label: "מס לתשלום", value: fmt(data.tax_after_credits) },
    { label: "שיעור מס אפקטיבי", value: `${(data.effective_rate * 100).toFixed(2)}%` },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400">חישוב מס לפי מדרגות 2024</p>
      <dl className="divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between py-1.5 text-sm">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
