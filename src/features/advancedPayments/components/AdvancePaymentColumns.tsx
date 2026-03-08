import type { Column } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../../../api/advancePayments.api";
import { Badge } from "../../../components/ui/Badge";
import { formatDate } from "../../../utils/utils";
import { fmtCurrency, MONTH_NAMES, STATUS_LABEL, STATUS_VARIANT } from "../utils";
import { EditAdvancePaymentInline } from "./EditAdvancePaymentInline";

interface BuildColumnsOptions {
  canEdit: boolean;
  updatingId: number | null;
  onUpdate: (id: number, paid_amount: number | null, status: AdvancePaymentStatus, expected_amount: number | null) => void;
}

export const buildAdvancePaymentColumns = (
  options?: BuildColumnsOptions,
): Column<AdvancePaymentRow>[] => {
  const base: Column<AdvancePaymentRow>[] = [
    {
      key: "month",
      header: "חודש",
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[row.month - 1] ?? row.month}
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
          {fmtCurrency(row.expected_amount)}
        </span>
      ),
    },
    {
      key: "paid_amount",
      header: "שולם",
      render: (row) => (
        <span className="font-mono text-sm font-semibold text-green-700 tabular-nums">
          {fmtCurrency(row.paid_amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "סטטוס",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? "neutral"}>
          {STATUS_LABEL[row.status] ?? row.status}
        </Badge>
      ),
    },
  ];

  if (options?.canEdit) {
    base.push({
      key: "actions",
      header: "",
      render: (row) => (
        <EditAdvancePaymentInline
          row={row}
          isUpdating={options.updatingId === row.id}
          onSave={(paid_amount, status, expected_amount) => options.onUpdate(row.id, paid_amount, status, expected_amount)}
        />
      ),
    });
  }

  return base;
};