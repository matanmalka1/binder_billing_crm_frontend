import type { TaxSubmissionWidgetResponse } from "../api";

interface TaxSubmissionStatsProps {
  data?: TaxSubmissionWidgetResponse;
}

const formatCurrency = (value: number) =>
  `₪${value.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const Stat = ({ value, label }: { value: number | string; label: string }) => (
  <div className="flex items-center gap-2.5 px-4 first:pr-0">
    <span className="text-2xl font-bold tabular-nums text-gray-900">{value}</span>
    <span className="text-xs leading-tight text-gray-500 max-w-[72px]">{label}</span>
  </div>
);

export const TaxSubmissionStats = ({ data }: TaxSubmissionStatsProps) => {
  if (!data) return null;

  return (
    <div className="flex flex-wrap items-center gap-0 divide-x divide-x-reverse divide-gray-200 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <Stat value={data.reports_submitted} label="דוחות שהוגשו" />
      <Stat value={data.reports_in_progress} label="בתהליך עבודה" />
      <Stat value={data.reports_not_started} label="טרם התחילו" />
      <Stat value={data.total_clients} label='סה"כ לקוחות' />
      {data.total_refund_due > 0 && (
        <Stat value={formatCurrency(data.total_refund_due)} label="החזרי מס" />
      )}
      {data.total_tax_due > 0 && (
        <Stat value={formatCurrency(data.total_tax_due)} label="תשלומי מס" />
      )}
      <div className="mr-auto flex items-center gap-1.5 pr-4">
        <span className="text-sm font-semibold text-positive-700">{data.submission_percentage}%</span>
        <span className="text-xs text-gray-400">אחוז השלמה</span>
      </div>
    </div>
  );
};

TaxSubmissionStats.displayName = "TaxSubmissionStats";