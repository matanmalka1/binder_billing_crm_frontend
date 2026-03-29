import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, reportsQK, type VatComplianceItem, type StalePendingItem } from "../api";
import { PageHeader } from "../../../components/layout/PageHeader";
import { PageStateGuard } from "../../../components/ui/PageStateGuard";
import { Badge } from "../../../components/ui/Badge";

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const selectCls =
  "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none";

const complianceBadgeVariant = (rate: number) => {
  if (rate >= 80) return "success" as const;
  if (rate >= 50) return "warning" as const;
  return "error" as const;
};

const ComplianceTable = ({ items }: { items: VatComplianceItem[] }) => {
  if (items.length === 0) return <p className="text-sm text-gray-500">אין נתונים לשנה זו.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-right">
          <tr>
            {["לקוח", "תקופות צפויות", "הוגשו", "פתוחות", "בזמן", "באיחור", "ציות"].map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item) => (
            <tr key={item.client_id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.client_name}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">{item.periods_expected}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">{item.periods_filed}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">{item.periods_open}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">{item.on_time_count}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">{item.late_count}</td>
              <td className="px-4 py-3">
                <Badge variant={complianceBadgeVariant(item.compliance_rate)}>
                  {item.compliance_rate.toFixed(1)}%
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StalePendingTable = ({ items }: { items: StalePendingItem[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-red-700">
        ממתין לחומרים מעל 30 יום ({items.length})
      </h3>
      <div className="overflow-x-auto rounded-lg border border-red-200">
        <table className="min-w-full divide-y divide-red-100 text-sm">
          <thead className="bg-red-50 text-right">
            <tr>
              {["לקוח", "תקופה", "ימים ממתין"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium text-red-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-red-50 bg-white">
            {items.map((item) => (
              <tr key={`${item.client_id}-${item.period}`} className="hover:bg-red-50">
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.client_name}</td>
                <td className="px-4 py-3 text-gray-700 tabular-nums">{item.period}</td>
                <td className="px-4 py-3">
                  <Badge variant="error">{item.days_pending} ימים</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const VatComplianceReportView: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, error } = useQuery({
    queryKey: reportsQK.vatCompliance(year),
    queryFn: () => reportsApi.getVatComplianceReport(year),
  });

  const description = data ? `${data.total_clients} לקוחות` : "";

  const header = (
    <PageHeader
      title='דוח ציות מע"מ'
      description={description}
      actions={
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={selectCls}
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      }
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error?.message ?? null} header={header} loadingMessage="טוען דוח...">
      {data && (
        <div className="space-y-6">
          <ComplianceTable items={data.items} />
          <StalePendingTable items={data.stale_pending} />
        </div>
      )}
    </PageStateGuard>
  );
};

VatComplianceReportView.displayName = "VatComplianceReportView";
