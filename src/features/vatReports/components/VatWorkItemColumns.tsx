import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatDateTime } from "../../../utils/utils";
import { formatVatAmount } from "../utils";
import { VatWorkItemRowActions } from "./VatWorkItemRowActions";
import type { ColumnOpts } from "../types";

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

export const buildVatWorkItemColumns = (opts: ColumnOpts): Column<VatWorkItemResponse>[] => [
  {
    key: "id",
    header: "מזהה",
    render: (item) => (
      <span className="font-mono text-sm text-gray-500 tabular-nums">#{item.id}</span>
    ),
  },
  {
    key: "client_id",
    header: "לקוח",
    render: (item) => (
      <span className="text-sm font-semibold text-gray-900">
        {item.client_name ?? `#${item.client_id}`}
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
        variantMap={statusVariants}
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
