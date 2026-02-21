import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatDateTime } from "../../../utils/utils";
import {
  canMarkMaterialsComplete,
  canMarkReadyForReview,
  canFile,
  isFiled,
  formatVatAmount,
} from "../utils/vatWorkItemStatus";
import type { VatWorkItemAction } from "../hooks/useVatWorkItemsPage";

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

interface ActionCellProps {
  item: VatWorkItemResponse;
  isAdvisor: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}

const ActionCell: React.FC<ActionCellProps> = ({
  item,
  isAdvisor,
  isLoading,
  isDisabled,
  runAction,
}) => {
  const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); fn(); };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {canMarkMaterialsComplete(item.status) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isLoading}
          disabled={isDisabled}
          onClick={stop(() => void runAction(item.id, "materialsComplete"))}
        >
          אישור קבלה
        </Button>
      )}
      {canMarkReadyForReview(item.status) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isLoading}
          disabled={isDisabled}
          onClick={stop(() => void runAction(item.id, "readyForReview"))}
        >
          שלח לבדיקה
        </Button>
      )}
      {isAdvisor && canFile(item.status) && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          disabled={isDisabled}
          onClick={stop(() => void runAction(item.id, "file"))}
        >
          הגשה
        </Button>
      )}
      {isFiled(item.status) && (
        <span className="text-xs text-gray-500">הוגש</span>
      )}
    </div>
  );
};
ActionCell.displayName = "ActionCell";

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
      <span className="font-mono text-sm font-semibold text-gray-900">#{item.id}</span>
    ),
  },
  {
    key: "client_id",
    header: "לקוח",
    render: (item) => (
      <span className="text-sm text-gray-900">
        {item.client_name ?? `#${item.client_id}`}
      </span>
    ),
  },
  {
    key: "period",
    header: "תקופה",
    render: (item) => (
      <span className="font-mono text-sm font-medium text-gray-900">{item.period}</span>
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
      <span className="font-mono text-sm tabular-nums text-gray-700">
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
    header: "פעולות",
    render: (item) => (
      <ActionCell
        item={item}
        isAdvisor={isAdvisor}
        isLoading={actionLoadingId === item.id}
        isDisabled={actionLoadingId !== null && actionLoadingId !== item.id}
        runAction={runAction}
      />
    ),
  },
];
