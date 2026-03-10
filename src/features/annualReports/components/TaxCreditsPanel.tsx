import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";

interface Props {
  reportId: number;
}

const CREDIT_POINT_VALUE = 2_904; // ₪ per credit point (2024)

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

interface CreditRow {
  label: string;
  description: string;
  amount: number;
}

export const TaxCreditsPanel: React.FC<Props> = ({ reportId }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.tax.annualReports.detail(reportId),
    queryFn: () => annualReportsApi.getReportDetails(reportId),
  });

  if (isLoading) return <p className="text-sm text-gray-400">טוען זיכויים...</p>;
  if (!data) return null;

  const creditPoints = data.credit_points ?? 2.25;
  const lifeInsuranceCredit = data.life_insurance_credit_points
    ? data.life_insurance_credit_points * CREDIT_POINT_VALUE
    : 0;
  const tuitionCredit = data.tuition_credit_points
    ? data.tuition_credit_points * CREDIT_POINT_VALUE
    : 0;
  const otherCredits = data.other_credits ?? 0;

  const basicCredit = creditPoints * CREDIT_POINT_VALUE;
  const pensionContribution = data.pension_contribution ?? 0;

  const rows: CreditRow[] = [
    {
      label: "נקודות זיכוי בסיסיות",
      description: `${creditPoints} נקודות × ₪${CREDIT_POINT_VALUE.toLocaleString("he-IL")}`,
      amount: basicCredit,
    },
  ];

  if (pensionContribution > 0) {
    rows.push({
      label: "הפקדות קרן השתלמות",
      description: "ניכוי 4.5% עד השכר",
      amount: pensionContribution * 0.045,
    });
  }

  if (lifeInsuranceCredit > 0) {
    rows.push({
      label: "ביטוח חיים / פנסיה",
      description: "זיכוי 25% עד ₪12,060",
      amount: lifeInsuranceCredit,
    });
  }

  if (tuitionCredit > 0) {
    rows.push({
      label: "שכר לימוד (ילדים)",
      description: `₪${CREDIT_POINT_VALUE.toLocaleString("he-IL")}/שנה`,
      amount: tuitionCredit,
    });
  }

  if (otherCredits > 0) {
    rows.push({
      label: "זיכויים אחרים",
      description: "זיכויים נוספים",
      amount: otherCredits,
    });
  }

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">זיכויי מס אישיים</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{r.label}</p>
              <p className="text-xs text-gray-400">{r.description}</p>
            </div>
            <span className="text-sm font-semibold text-blue-700">{fmt(r.amount)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
        <span className="text-sm font-semibold text-gray-700">סה"כ זיכויים</span>
        <span className="text-sm font-bold text-blue-800">{fmt(total)}</span>
      </div>
    </div>
  );
};
