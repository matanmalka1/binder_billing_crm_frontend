import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../../components/ui/primitives/Button";
import { getChargeStatusLabel } from "../../../../utils/enums";
import { annualReportChargesApi, annualReportsQK } from "../../api";

interface Props { reportId: number; }

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

export const ReportChargesPanel: React.FC<Props> = ({ reportId }) => {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const { data, isLoading } = useQuery({
    queryKey: annualReportsQK.reportCharges(reportId, page, PAGE_SIZE),
    queryFn: () => annualReportChargesApi.listCharges(reportId, page, PAGE_SIZE),
    enabled: !!reportId,
  });

  if (isLoading) return <p className="py-8 text-center text-sm text-gray-400">טוען חיובים...</p>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (items.length === 0)
    return <p className="py-10 text-center text-sm text-gray-400">לא נמצאו חיובים המקושרים לדוח זה</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">סה"כ {total} חיובים (מידע בלבד)</p>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-right">תיאור</th>
              <th className="px-4 py-3 text-right">סכום</th>
              <th className="px-4 py-3 text-right">סטטוס</th>
              <th className="px-4 py-3 text-right">תאריך יצירה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((charge) => (
              <tr key={charge.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{charge.description ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{fmt(charge.amount)}</td>
                <td className="px-4 py-3 text-gray-600">{getChargeStatusLabel(charge.status)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(charge.created_at).toLocaleDateString("he-IL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>הקודם</Button>
          <span className="text-gray-500">{page} / {totalPages}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>הבא</Button>
        </div>
      )}
    </div>
  );
};

ReportChargesPanel.displayName = "ReportChargesPanel";
