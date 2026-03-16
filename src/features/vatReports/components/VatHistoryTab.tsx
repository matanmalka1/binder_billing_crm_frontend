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

interface VatHistoryTabProps {
  workItemId: number;
}

export const VatHistoryTab: React.FC<VatHistoryTabProps> = ({ workItemId }) => {
  const { data, isPending } = useQuery({
    queryKey: QK.tax.vatWorkItems.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
  });

  const items = [...(data?.items ?? [])].reverse();

  if (isPending) {
    return <p className="py-8 text-center text-sm text-gray-400">טוען...</p>;
  }

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">אין היסטוריה</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100" dir="rtl">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-right">תאריך</th>
            <th className="px-4 py-3 text-right">פעולה</th>
            <th className="px-4 py-3 text-right">פרטים</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((entry) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

VatHistoryTab.displayName = "VatHistoryTab";
