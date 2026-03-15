import { useQuery } from "@tanstack/react-query";
import { annualReportTaxApi } from "../../../../api/annualReport.tax.api";
import { QK } from "../../../../lib/queryKeys";

interface Props {
  reportId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const BALANCE_STYLES = {
  due: { label: "עוד לתשלום", className: "text-red-600 font-semibold" },
  refund: { label: "החזר מס", className: "text-green-600 font-semibold" },
  zero: { label: "מאוזן", className: "text-gray-500 font-semibold" },
};

export const FinalBalancePanel: React.FC<Props> = ({ reportId }) => {
  const taxQuery = useQuery({
    queryKey: QK.tax.annualReportTaxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
    enabled: !!reportId,
  });

  const advancesQuery = useQuery({
    queryKey: QK.tax.annualReportAdvancesSummary(reportId),
    queryFn: () => annualReportTaxApi.getAdvancesSummary(reportId),
    enabled: !!reportId,
  });

  if (taxQuery.isLoading || advancesQuery.isLoading)
    return <p className="text-sm text-gray-400">טוען נתונים...</p>;

  if (taxQuery.isError || advancesQuery.isError || !taxQuery.data || !advancesQuery.data)
    return <p className="text-sm text-red-500">שגיאה בטעינת יתרה סופית</p>;

  const tax = taxQuery.data;
  const adv = advancesQuery.data;
  const style = BALANCE_STYLES[adv.balance_type];
  const absBalance = Math.abs(adv.final_balance);

  return (
    <div className="space-y-2">
      <dl className="divide-y divide-gray-100">
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">חבות מס</dt>
          <dd className="font-medium text-gray-900">{fmt(tax.tax_after_credits)}</dd>
        </div>
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">סה"כ מקדמות ששולמו ({adv.advances_count})</dt>
          <dd className="font-medium text-gray-900">{fmt(adv.total_advances_paid)}</dd>
        </div>
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">יתרה סופית</dt>
          <dd className={style.className}>
            {fmt(absBalance)} — {style.label}
          </dd>
        </div>
      </dl>
    </div>
  );
};
