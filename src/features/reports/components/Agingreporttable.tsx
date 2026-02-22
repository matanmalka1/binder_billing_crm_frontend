import { useNavigate } from "react-router-dom";
import type { AgingReportItem } from "../../../api/reports.api";

interface AgingReportTableProps {
  items: AgingReportItem[];
}

const fmt = (n: number) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const AgingReportTable: React.FC<AgingReportTableProps> = ({ items }) => {
  const navigate = useNavigate();

  if (items.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">אין חובות פתוחים</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
      {items.map((item) => (
        <div
          key={item.client_id}
          onClick={() => navigate(`/clients/${item.client_id}`)}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-fade-in cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Client */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{item.client_name}</p>
              <p className="text-xs text-gray-500">לקוח #{item.client_id}</p>
            </div>
            {item.days_90_plus > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                דורש טיפול
              </span>
            )}
          </div>

          {/* Total */}
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            {fmt(item.total_outstanding)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">סה"כ חוב פתוח</p>

          {item.oldest_invoice_date && (
            <div className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-500">
              חוב מאז {new Date(item.oldest_invoice_date).toLocaleDateString("he-IL")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

AgingReportTable.displayName = "AgingReportTable";
