import { MessageSquare, Trash2 } from "lucide-react";
import type { Column } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../api/advancePayments.types";
import { Badge } from "../../../components/ui/Badge";
import { formatDate } from "../../../utils/utils";
import { fmtCurrency, MONTH_NAMES, STATUS_LABEL, STATUS_VARIANT } from "../utils";
import { EditAdvancePaymentInline } from "./EditAdvancePaymentInline";

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
        const colorClass = row.delta > 0
          ? "text-red-600"
          : row.delta < 0
            ? "text-green-600"
            : "text-gray-400";
        return (
          <span className={`font-mono text-sm tabular-nums ${colorClass}`}>
            {fmtCurrency(row.delta)}
          </span>
        );
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
      render: (row) => (
        <div className="flex items-center gap-1">
          <EditAdvancePaymentInline
            row={row}
            isUpdating={options.updatingId === row.id}
            onSave={(paid_amount, status, expected_amount) => options.onUpdate(row.id, paid_amount, status, expected_amount)}
          />
          <button
            type="button"
            disabled={options.deletingId === row.id}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("האם למחוק את המקדמה?")) {
                options.onDelete(row.id);
              }
            }}
            className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="מחק"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    });
  }

  return base;
};