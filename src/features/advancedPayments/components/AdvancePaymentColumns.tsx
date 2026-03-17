import { MessageSquare } from "lucide-react";
import type { Column } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { Badge } from "../../../components/ui/Badge";
import { MonoValue } from "../../../components/ui/MonoValue";
import { formatDate } from "../../../utils/utils";
import { getAdvancePaymentStatusLabel } from "../../../utils/enums";
import { fmtCurrency, MONTH_NAMES, STATUS_VARIANT } from "../utils";
import { AdvancePaymentRowActions } from "./AdvancePaymentRowActions";

interface BuildColumnsOptions {
  canEdit: boolean;
  updatingId: number | null;
  deletingId: number | null;
  onUpdate: (id: number, paid_amount: number | null, status: AdvancePaymentStatus, expected_amount: number | null) => void;
  onDelete: (id: number) => void;
}

export const buildAdvancePaymentColumns = (
  options?: BuildColumnsOptions,
): Column<AdvancePaymentRow>[] => {
  const base: Column<AdvancePaymentRow>[] = [
    {
      key: "month",
      header: "תקופה",
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[row.month - 1] ?? row.month}
        </span>
      ),
    },
    {
      key: "expected_amount",
      header: "צפוי",
      render: (row) => <MonoValue value={fmtCurrency(row.expected_amount)} />,
    },
    {
      key: "paid_amount",
      header: "שולם",
      render: (row) => <MonoValue value={fmtCurrency(row.paid_amount)} tone="positive" />,
    },
    {
      key: "status",
      header: "סטטוס",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? "neutral"}>
          {getAdvancePaymentStatusLabel(row.status)}
        </Badge>
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
      key: "delta",
      header: "הפרש",
      render: (row) => {
        if (row.delta == null) return <span className="text-gray-400 text-sm">—</span>;
        const tone = row.delta > 0 ? "negative" : row.delta < 0 ? "positive" : "neutral";
        return <MonoValue value={fmtCurrency(row.delta)} tone={tone} />;
      },
    },
    {
      key: "notes",
      header: "",
      render: (row) =>
        row.notes ? (
          <span title={row.notes} className="text-gray-400 hover:text-gray-600 cursor-default">
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
        ) : null,
    },
  ];

  if (options?.canEdit) {
    base.push({
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (row) => (
        <AdvancePaymentRowActions
          row={row}
          updatingId={options.updatingId}
          deletingId={options.deletingId}
          onUpdate={options.onUpdate}
          onDelete={options.onDelete}
        />
      ),
    });
  }

  return base;
};
