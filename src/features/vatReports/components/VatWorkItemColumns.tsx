import { AlertTriangle } from "lucide-react";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import type { Column } from "../../../components/ui/table/DataTable";
import type { VatWorkItemResponse } from "../api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatDate, formatDateTime } from "../../../utils/utils";
import { VAT_STATUS_BADGE_VARIANTS } from "../constants";
import { formatVatAmount } from "../utils";
import { VatWorkItemRowActions } from "./VatWorkItemRowActions";
import type { ColumnOpts } from "../types";

export const buildVatWorkItemColumns = (opts: ColumnOpts): Column<VatWorkItemResponse>[] => [
  {
    key: "id",
    header: "מזהה",
    render: (item) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">#{item.id}</span>
    ),
  },
  {
    key: "business_id",
    header: "עסק",
    render: (item) => (
      <span className="text-sm font-semibold text-gray-900">
        {item.business_name ?? `#${item.business_id}`}
      </span>
    ),
  },
  {
    key: "period",
    header: "תקופה",
    render: (item) => (
      <span className="font-mono text-sm font-medium text-gray-700">{item.period}</span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (item) => (
      <StatusBadge
        status={item.status}
        getLabel={getVatWorkItemStatusLabel}
        variantMap={VAT_STATUS_BADGE_VARIANTS}
      />
    ),
  },
  {
    key: "net_vat",
    header: 'מע"מ נטו',
    render: (item) => {
      const amount =
        item.is_overridden && item.final_vat_amount != null
          ? item.final_vat_amount
          : item.net_vat;
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums ${Number(amount) >= 0 ? "text-red-600" : "text-green-600"}`}>
          {formatVatAmount(amount)}
          {item.is_overridden && (
            <span className="rounded bg-amber-100 px-1 py-0.5 text-xs font-medium text-amber-700">
              עוקף
            </span>
          )}
        </span>
      );
    },
  },
  {
    key: "submission_deadline",
    header: "מועד הגשה",
    render: (item) => {
      const displayDeadline = item.extended_deadline ?? item.submission_deadline;
      if (!displayDeadline) return <span className="text-gray-400 text-sm">—</span>;
      const cls = item.is_overdue
        ? "text-red-600 font-semibold"
        : item.days_until_deadline != null && item.days_until_deadline <= 3
          ? "text-orange-600 font-medium"
          : "text-gray-600";
      return (
        <span className={`font-mono text-sm tabular-nums inline-flex items-center gap-1 ${cls}`}>
          {item.is_overdue && <AlertTriangle className="h-3.5 w-3.5" />}
          {formatDate(displayDeadline)}
        </span>
      );
    },
  },
  {
    key: "updated_at",
    header: "עדכון אחרון",
    render: (item) => (
      <span className="text-sm text-gray-400 tabular-nums">{formatDateTime(item.updated_at)}</span>
    ),
  },
  {
    key: "filed_at",
    header: "הוגש ב",
    render: (item) => (
      <span className="text-sm text-gray-500 tabular-nums">
        {item.filed_at ? formatDateTime(item.filed_at) : "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    render: (item) => (
      <VatWorkItemRowActions
        item={item}
        isLoading={opts.isLoading}
        isDisabled={opts.isDisabled}
        runAction={opts.runAction}
      />
    ),
  },
];
