import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";
import { formatDateTime } from "../../../utils/utils";

const ACTION_LABELS: Record<string, string> = {
  material_received: "קבלת חומרים",
  status_changed: "שינוי סטטוס",
  invoice_added: "חשבונית נוספה",
  invoice_deleted: "חשבונית נמחקה",
  vat_override: "עקיפת סכום מע\"מ",
  vat_calculated: 'חישוב מע"מ',
  filed: "הוגש",
};

const PAGE_SIZE = 20;

interface VatHistoryTabProps {
  workItemId: number;
}

export const VatHistoryTab: React.FC<VatHistoryTabProps> = ({ workItemId }) => {
  const [page, setPage] = useState(0);
  const { data, isPending } = useQuery({
    queryKey: QK.tax.vatWorkItems.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
  });

  const items = [...(data?.items ?? [])].reverse();
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isPending) {
    return <p className="py-8 text-center text-sm text-gray-400">טוען...</p>;
  }

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">אין היסטוריה</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-gray-100" dir="rtl">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-right">תאריך</th>
              <th className="px-4 py-3 text-right">פעולה</th>
              <th className="px-4 py-3 text-right">פרטים</th>
              <th className="px-4 py-3 text-right">בוצע ע&quot;י</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageItems.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 text-gray-500 tabular-nums whitespace-nowrap">
                  {formatDateTime(entry.performed_at)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                  {entry.note ?? entry.new_value ?? entry.old_value ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {entry.performed_by_name ?? `#${entry.performed_by}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500" dir="rtl">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הקודם
          </button>
          <span>
            עמוד {page + 1} מתוך {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
};

VatHistoryTab.displayName = "VatHistoryTab";
