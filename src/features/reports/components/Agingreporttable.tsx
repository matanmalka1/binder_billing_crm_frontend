import { DataTable, type Column } from "../../../components/ui/DataTable";
import type { AgingReportItem } from "../../../api/reports.api";
import { cn } from "../../../utils/utils";

interface AgingReportTableProps {
  items: AgingReportItem[];
}

const buildAgingColumns = (): Column<AgingReportItem>[] => [
  {
    key: "client_name",
    header: "לקוח",
    render: (item) => (
      <div>
        <div className="font-medium text-gray-900">{item.client_name}</div>
        <div className="text-xs text-gray-500">לקוח #{item.client_id}</div>
      </div>
    ),
  },
  {
    key: "total",
    header: 'סה"כ חוב',
    render: (item) => (
      <span className="font-bold text-gray-900">
        ₪
        {item.total_outstanding.toLocaleString("he-IL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: "current",
    header: "שוטף (0-30)",
    render: (item) => (
      <span className="text-green-700">
        ₪{item.current.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "days_30",
    header: "31-60 ימים",
    render: (item) => (
      <span className="text-yellow-700">
        ₪{item.days_30.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "days_60",
    header: "61-90 ימים",
    render: (item) => (
      <span className="text-orange-700">
        ₪{item.days_60.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "days_90",
    header: "90+ ימים",
    render: (item) => (
      <span className="text-red-700 font-semibold">
        ₪
        {item.days_90_plus.toLocaleString("he-IL", {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: "oldest",
    header: "חוב עתיק ביותר",
    render: (item) =>
      item.oldest_invoice_days ? (
        <div className="text-sm">
          <div className="text-gray-700">{item.oldest_invoice_days} ימים</div>
          <div className="text-xs text-gray-500">
            {item.oldest_invoice_date
              ? new Date(item.oldest_invoice_date).toLocaleDateString("he-IL")
              : "—"}
          </div>
        </div>
      ) : (
        <span className="text-gray-500">—</span>
      ),
  },
];

export const AgingReportTable: React.FC<AgingReportTableProps> = ({
  items,
}) => {
  const columns = buildAgingColumns();

  return (
    <DataTable
      data={items}
      columns={columns}
      getRowKey={(item) => item.client_id}
      emptyMessage="אין חובות פתוחים"
      rowClassName={(item) =>
        cn("animate-fade-in", item.days_90_plus > 0 && "bg-red-50/30")
      }
    />
  );
};
