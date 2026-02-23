import type { Column } from "../../../components/ui/DataTable";
import type {
  AdvancePaymentRow,
  AdvancePaymentStatus,
} from "../../../api/advancePayments.api";
import { Badge } from "../../../components/ui/Badge";
import { formatDate } from "../../../utils/utils";

const monthNames = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const statusMap: Record<
  AdvancePaymentStatus,
  "success" | "warning" | "error" | "neutral" | "info"
> = {
  paid: "success",
  partial: "warning",
  overdue: "error",
  pending: "neutral",
};

const statusLabels: Record<AdvancePaymentStatus, string> = {
  paid: "שולם",
  partial: "חלקי",
  overdue: "באיחור",
  pending: "ממתין",
};

const fmt = (n: number | null) =>
  n != null
    ? `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`
    : "—";

export const buildAdvancePaymentColumns = (): Column<AdvancePaymentRow>[] => [
  {
    key: "month",
    header: "חודש",
    render: (row) => (
      <span className="text-sm font-semibold text-gray-900">
        {monthNames[row.month - 1] ?? row.month}
      </span>
    ),
  },
  {
    key: "due_date",
    header: "תאריך תשלום",
    render: (row) => (
      <span className="text-sm text-gray-500 tabular-nums">{formatDate(row.due_date)}</span>
    ),
  },
  {
    key: "expected_amount",
    header: "סכום צפוי",
    render: (row) => (
      <span className="font-mono text-sm font-medium text-gray-700 tabular-nums">
        {fmt(row.expected_amount)}
      </span>
    ),
  },
  {
    key: "paid_amount",
    header: "שולם",
    render: (row) => (
      <span className="font-mono text-sm font-semibold text-green-700 tabular-nums">
        {fmt(row.paid_amount)}
      </span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (row) => (
      <Badge variant={statusMap[row.status] ?? "neutral"}>
        {statusLabels[row.status] ?? row.status}
      </Badge>
    ),
  },
];
