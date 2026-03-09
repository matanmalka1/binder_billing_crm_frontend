import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { cn } from "../../../utils/utils";
import { TaxBracketsTable } from "./TaxBracketsTable";

interface Props {
  reportId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const Row: React.FC<{ label: string; value: string; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className="flex justify-between py-1.5 text-sm">
    <dt className="text-gray-500">{label}</dt>
    <dd className={cn("font-medium text-gray-900", className)}>{value}</dd>
  </div>
);

export const TaxCalculationPanel: React.FC<Props> = ({ reportId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QK.tax.annualReportTaxCalc(reportId),
    queryFn: () => annualReportsApi.getTaxCalculation(reportId),
  });

  if (isLoading) return <p className="text-sm text-gray-400">מחשב מס...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">שגיאה בטעינת חישוב מס</p>;

  const liabilityColor =
    data.total_liability === null
      ? ""
      : data.total_liability > 0
        ? "text-red-600"
        : "text-green-600";

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">חישוב מס לפי מדרגות 2024</p>

      {/* סיכום מס הכנסה */}
      <dl className="divide-y divide-gray-100">
        <Row label="הכנסה חייבת" value={fmt(data.taxable_income)} />
        <Row label="ניכוי פנסיה" value={fmt(data.pension_deduction)} />
        <Row label="מס לפני זיכויים" value={fmt(data.tax_before_credits)} />
        <Row label="שווי נקודות זיכוי" value={fmt(data.credit_points_value)} />
        {data.donation_credit > 0 && (
          <Row label="זיכוי תרומות (סע׳ 46)" value={fmt(data.donation_credit)} />
        )}
        <Row label="מס לתשלום" value={fmt(data.tax_after_credits)} />
        <Row
          label="שיעור מס אפקטיבי"
          value={`${(data.effective_rate * 100).toFixed(2)}%`}
        />
      </dl>

      {/* ביטוח לאומי */}
      <div>
        <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          ביטוח לאומי
        </p>
        <dl className="divide-y divide-gray-100">
          <Row
            label="עד תקרה (5.97%)"
            value={fmt(data.national_insurance.base_amount)}
          />
          <Row
            label="מעל תקרה (17.83%)"
            value={fmt(data.national_insurance.high_amount)}
          />
          <Row
            label="סה״כ ביטוח לאומי"
            value={fmt(data.national_insurance.total)}
            className="font-semibold"
          />
        </dl>
      </div>

      {/* רווח נקי + חבות כוללת */}
      <dl className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-gray-50 px-3">
        <Row label="רווח נקי" value={fmt(data.net_profit)} />
        {data.total_liability !== null && (
          <Row
            label="חבות כוללת (מס + בל + מע״מ − מקדמות)"
            value={fmt(data.total_liability)}
            className={liabilityColor}
          />
        )}
      </dl>

      {/* מדרגות */}
      <TaxBracketsTable brackets={data.brackets} />
    </div>
  );
};