import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import type { AdvancePaymentReportItem, AdvancePaymentReportResponse } from "../api";

interface Props {
  data: AdvancePaymentReportResponse;
}

const columns: Column<AdvancePaymentReportItem>[] = [
  {
    key: "client_name",
    header: "לקוח",
    render: (r) => (
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900">{r.client_name}</div>
        <div className="text-xs text-gray-500">לקוח #{r.client_record_id}</div>
      </div>
    ),
  },
  {
    key: "total_expected",
    header: "צפוי",
    render: (r) => (
      <span className="text-sm text-gray-700">₪{r.total_expected.toLocaleString()}</span>
    ),
  },
  {
    key: "total_paid",
    header: "שולם",
    render: (r) => (
      <span className="text-sm text-positive-700">₪{r.total_paid.toLocaleString()}</span>
    ),
  },
  {
    key: "gap",
    header: "פער",
    render: (r) => (
      <span className={`text-sm font-medium ${r.gap > 0 ? "text-negative-600" : "text-gray-500"}`}>
        ₪{r.gap.toLocaleString()}
      </span>
    ),
  },
  {
    key: "overdue_count",
    header: "חיובים באיחור",
    render: (r) => (
      <span className={`text-sm ${r.overdue_count > 0 ? "text-negative-600 font-semibold" : "text-gray-400"}`}>
        {r.overdue_count}
      </span>
    ),
  },
];

export const AdvancePaymentReportTable: React.FC<Props> = ({ data }) => (
  <div className="rounded-xl border border-gray-200 overflow-hidden">
    <DataTable
      data={data.items}
      columns={columns}
      getRowKey={(r) => r.client_record_id}
      emptyMessage="אין נתונים לתצוגה"
    />
    {data.items.length > 0 && (
      <div className="flex items-center gap-6 px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm font-medium text-gray-700">
        <span>סה״כ: ₪{data.total_expected.toLocaleString()} צפוי</span>
        <span className="text-positive-700">₪{data.total_paid.toLocaleString()} שולם</span>
        <span className={data.total_gap > 0 ? "text-negative-600" : "text-gray-500"}>
          פער: ₪{data.total_gap.toLocaleString()}
        </span>
        <span className="mr-auto text-blue-700">
          אחוז גבייה: {data.collection_rate.toFixed(1)}%
        </span>
      </div>
    )}
  </div>
);
