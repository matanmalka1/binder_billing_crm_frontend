import { useMemo } from "react";
import { Inbox } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { TaxDeadlineRowActions } from "./TaxDeadlineRowActions";
import type { TaxDeadlineResponse } from "../api";
import { getDeadlineTypeLabel } from "../api";
import { formatClientOfficeId } from "../../../utils/utils";
import {
  DeadlineAmountCell,
  DeadlineDateCell,
  DeadlineStatusBadge,
  DeadlineUrgencyBadge,
} from "./TaxDeadlineTableParts";
import { getDeadlineRowClassName } from "./taxDeadlineTableUtils";
import { getTaxDeadlinePeriodLabel, groupTaxDeadlinesByMonth } from "../utils";

interface TaxDeadlinesTableProps {
  deadlines: TaxDeadlineResponse[];
  onComplete?: (id: number) => void;
  onReopen?: (id: number) => void;
  completingId: number | null;
  reopeningId?: number | null;
  onRowClick?: (deadline: TaxDeadlineResponse) => void;
  onEdit?: (deadline: TaxDeadlineResponse) => void;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
}

export const TaxDeadlinesTable = ({
  deadlines,
  onComplete,
  onReopen,
  completingId,
  reopeningId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: TaxDeadlinesTableProps) => {
  const columns = useMemo<Column<TaxDeadlineResponse>[]>(
    () => [
      {
        key: "office_client_number",
        header: "מס' לקוח",
        render: (deadline) => (
          <span className="font-mono text-sm text-gray-500 tabular-nums">
            {formatClientOfficeId(deadline.office_client_number)}
          </span>
        ),
      },
      {
        key: "client_name",
        header: "לקוח",
        render: (deadline) => (
          <span className="block max-w-[220px] truncate text-sm font-semibold text-gray-900">
            {deadline.client_name ?? `לקוח #${deadline.client_record_id}`}
          </span>
        ),
      },
      {
        key: "deadline_type",
        header: "סוג",
        render: (deadline) => (
          <span className="text-sm text-gray-500">{getDeadlineTypeLabel(deadline.deadline_type)}</span>
        ),
      },
      {
        key: "period",
        header: "תקופה",
        render: (deadline) => (
          <span className="text-sm text-gray-500">{getTaxDeadlinePeriodLabel(deadline)}</span>
        ),
      },
      {
        key: "due_date",
        header: "מועד",
        render: (deadline) => <DeadlineDateCell dueDate={deadline.due_date} />,
      },
      {
        key: "urgency",
        header: "דחיפות",
        render: (deadline) => <DeadlineUrgencyBadge deadline={deadline} />,
      },
      {
        key: "payment_amount",
        header: "סכום",
        render: (deadline) => <DeadlineAmountCell amount={deadline.payment_amount} status={deadline.status} />,
      },
      {
        key: "status",
        header: "סטטוס",
        render: (deadline) => <DeadlineStatusBadge status={deadline.status} />,
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-10",
        className: "w-10",
        render: (deadline) => (
          <TaxDeadlineRowActions
            deadline={deadline}
            completingId={completingId}
            reopeningId={reopeningId}
            deletingId={deletingId}
            onComplete={onComplete}
            onReopen={onReopen}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [completingId, deletingId, onComplete, onDelete, onEdit, onReopen, reopeningId],
  );

  const groups = useMemo(() => groupTaxDeadlinesByMonth(deadlines), [deadlines]);

  if (deadlines.length === 0) {
    return (
      <DataTable
        data={[]}
        columns={columns}
        getRowKey={(d) => d.id}
        emptyState={{
          icon: Inbox,
          title: "אין מועדים להצגה",
          message: "לא נמצאו מועדי מס התואמים לסינון הנוכחי",
          variant: "illustration",
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="text-sm font-semibold text-gray-600">{group.label}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {group.items.length}
            </span>
          </div>
          <DataTable
            data={group.items}
            columns={columns}
            getRowKey={(d) => d.id}
            onRowClick={onRowClick}
            rowClassName={getDeadlineRowClassName}
          />
        </div>
      ))}
    </div>
  );
};

TaxDeadlinesTable.displayName = "TaxDeadlinesTable";
