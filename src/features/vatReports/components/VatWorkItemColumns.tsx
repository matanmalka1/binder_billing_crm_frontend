import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatDateTime } from "../../../utils/utils";
import { formatVatAmount } from "../utils";
import type { VatWorkItemAction } from "../hooks/useVatWorkItemsPage";
import { VatWorkItemRowActions } from "./VatWorkItemRowActions";

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

interface BuildColumnsParams {
  isAdvisor: boolean;
  actionLoadingId: number | null;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}

export const buildVatWorkItemColumns = ({
  isAdvisor,
  actionLoadingId,
  runAction,
}: BuildColumnsParams): Column<VatWorkItemResponse>[] => [
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
    render: (item) => (
      <span className="font-mono text-sm font-semibold text-gray-900 tabular-nums">
        {formatVatAmount(item.net_vat)}
      </span>
    ),
  },
  {
    key: "final_vat_amount",
    header: "סכום סופי",
    render: (item) => (
      <span className="font-mono text-sm text-gray-600 tabular-nums">
        {formatVatAmount(item.final_vat_amount)}
      </span>
    ),
  },
  {
    key: "updated_at",
    header: "עדכון אחרון",
    render: (item) => (
      <span className="text-sm text-gray-500 tabular-nums">
        {formatDateTime(item.updated_at)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    render: (item) => (
      <VatWorkItemRowActions
        item={item}
        isAdvisor={isAdvisor}
        isLoading={actionLoadingId === item.id}
        isDisabled={actionLoadingId !== null && actionLoadingId !== item.id}
        runAction={runAction}
      />
    ),
  },
];
