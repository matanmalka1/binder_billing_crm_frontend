import { MessageSquare } from "lucide-react";
import type { Column } from "../../../components/ui/table/DataTable";
import type { AdvancePaymentRow } from "../types";
import { MonoValue } from "../../../components/ui/primitives/MonoValue";
import { formatDate } from "../../../utils/utils";
import { fmtCurrency, getAdvancePaymentMonthLabel } from "../utils";
import {
  AdvancePaymentRowActions,
  type AdvancePaymentRowActionsProps,
} from "./AdvancePaymentRowActions";
import { AdvancePaymentStatusBadge } from "./AdvancePaymentStatusBadge";

interface BuildColumnsOptions extends Omit<AdvancePaymentRowActionsProps, "row"> {
  canEdit: boolean;
}

export const buildAdvancePaymentColumns = (
  options?: BuildColumnsOptions,
): Column<AdvancePaymentRow>[] => {
  const base: Column<AdvancePaymentRow>[] = [
    {
      key: "period",
      header: "תקופה",
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">
          {getAdvancePaymentMonthLabel(row.period, row.period_months_count)}
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
      render: (row) => <AdvancePaymentStatusBadge status={row.status} />,
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
        const numericDelta = Number(row.delta);
        const tone = numericDelta > 0 ? "negative" : numericDelta < 0 ? "positive" : "neutral";
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
