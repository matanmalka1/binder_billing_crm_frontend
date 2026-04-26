import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { Select } from "../../../components/ui/inputs/Select";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { taxDeadlinesApi, taxDeadlinesQK, getDeadlineTypeLabel } from "../api";
import type { TaxDeadlineResponse } from "../api";
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_STATUS_OPTIONS,
  getTaxDeadlineStatusLabel,
  getTaxDeadlineTypeLabel,
} from "../constants";
import { getTaxDeadlinePeriodLabel } from "../utils";
import { useClientDeadlineActions } from "../hooks/useClientDeadlineActions";
import { TaxDeadlineRowActions } from "./TaxDeadlineRowActions";
import { EditTaxDeadlineFormModal } from "./EditTaxDeadlineForm";
import { DeadlineSummaryCards } from "./DeadlineSummaryCards";
import {
  DeadlineAmountCell,
  DeadlineDateCell,
  DeadlineStatusBadge,
  DeadlineUrgencyBadge,
} from "./TaxDeadlineTableParts";
import { getDeadlineRowClassName } from "./taxDeadlineTableUtils";

interface FilingTimelineProps {
  clientId: number;
}

interface FilterState {
  status: string;
  type: string;
  year: string;
  overdueOnly: boolean;
}

// Fetch limit for embedded client deadlines tab.
// Clients with more than 100 deadlines are rare; raise if needed.
const CLIENT_DEADLINES_PAGE_SIZE = 100;

const sortDeadlines = (items: TaxDeadlineResponse[]) => {
  const rank = (deadline: TaxDeadlineResponse) => {
    if (deadline.status !== "pending") return 2;
    if (deadline.urgency_level === "overdue") return 0;
    return 1;
  };

  return [...items].sort((a, b) => {
    const rankDelta = rank(a) - rank(b);
    if (rankDelta !== 0) return rankDelta;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
};

const getYearOptions = (deadlines: TaxDeadlineResponse[]) => {
  const years = Array.from(new Set(deadlines.map((deadline) => new Date(deadline.due_date).getFullYear())))
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => b - a);
  return [{ value: "", label: "כל השנים" }, ...years.map((year) => ({ value: String(year), label: String(year) }))];
};

const TimelineToolbar = ({
  filters,
  yearOptions,
  onChange,
  onReset,
}: {
  filters: FilterState;
  yearOptions: { value: string; label: string }[];
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
}) => {
  const hasFilters = Boolean(filters.status || filters.type || filters.year || filters.overdueOnly);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            options={TAX_DEADLINE_STATUS_OPTIONS}
          />
          <Select
            label="סוג"
            value={filters.type}
            onChange={(e) => onChange({ type: e.target.value })}
            options={TAX_DEADLINE_FILTER_TYPE_OPTIONS}
          />
          <Select
            label="שנה"
            value={filters.year}
            onChange={(e) => onChange({ year: e.target.value })}
            options={yearOptions}
          />
          <label className="flex h-10 items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={filters.overdueOnly}
              onChange={(e) => onChange({ overdueOnly: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            באיחור בלבד
          </label>
        </div>
        {hasFilters && (
          <ActiveFilterBadges
            badges={[
              filters.status
                ? { key: "status", label: getTaxDeadlineStatusLabel(filters.status), onRemove: () => onChange({ status: "" }) }
                : null,
              filters.type
                ? { key: "type", label: getTaxDeadlineTypeLabel(filters.type), onRemove: () => onChange({ type: "" }) }
                : null,
              filters.year
                ? { key: "year", label: `שנה: ${filters.year}`, onRemove: () => onChange({ year: "" }) }
                : null,
              filters.overdueOnly
                ? { key: "overdueOnly", label: "באיחור בלבד", onRemove: () => onChange({ overdueOnly: false }) }
                : null,
            ].filter((badge): badge is NonNullable<typeof badge> => badge !== null)}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  );
};

export const FilingTimeline: React.FC<FilingTimelineProps> = ({ clientId }) => {
  const [filters, setFilters] = useState<FilterState>({ status: "", type: "", year: "", overdueOnly: false });
  const actions = useClientDeadlineActions(clientId);
  const listParams = useMemo(
    () => ({ client_record_id: clientId, page: 1, page_size: CLIENT_DEADLINES_PAGE_SIZE }),
    [clientId],
  );

  const { data, isLoading } = useQuery({
    queryKey: taxDeadlinesQK.list(listParams),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines(listParams),
  });

  const allDeadlines = useMemo(() => data?.items ?? [], [data?.items]);
  const yearOptions = useMemo(() => getYearOptions(allDeadlines), [allDeadlines]);
  const displayData = useMemo(() => {
    let items = allDeadlines;
    if (filters.status) items = items.filter((deadline) => deadline.status === filters.status);
    if (filters.type) items = items.filter((deadline) => deadline.deadline_type === filters.type);
    if (filters.year) {
      items = items.filter((deadline) => new Date(deadline.due_date).getFullYear() === Number(filters.year));
    }
    if (filters.overdueOnly) {
      items = items.filter((deadline) => deadline.status === "pending" && deadline.urgency_level === "overdue");
    }
    return sortDeadlines(items);
  }, [allDeadlines, filters]);

  const columns = useMemo<Column<TaxDeadlineResponse>[]>(
    () => [
      { key: "due_date", header: "מועד", render: (deadline) => <DeadlineDateCell dueDate={deadline.due_date} /> },
      { key: "urgency", header: "דחיפות", render: (deadline) => <DeadlineUrgencyBadge deadline={deadline} /> },
      { key: "deadline_type", header: "סוג", render: (deadline) => <span className="text-sm text-gray-500">{getDeadlineTypeLabel(deadline.deadline_type)}</span> },
      { key: "period", header: "תקופה", render: (deadline) => <span className="text-sm text-gray-500">{getTaxDeadlinePeriodLabel(deadline)}</span> },
      { key: "payment_amount", header: "סכום", render: (deadline) => <DeadlineAmountCell amount={deadline.payment_amount} status={deadline.status} /> },
      { key: "status", header: "סטטוס", render: (deadline) => <DeadlineStatusBadge status={deadline.status} /> },
      {
        key: "actions",
        header: "פעולות",
        headerClassName: "w-16",
        className: "w-16",
        render: (deadline) => (
          <TaxDeadlineRowActions
            deadline={deadline}
            completingId={actions.completingId}
            reopeningId={actions.reopeningId}
            deletingId={actions.deletingId}
            onComplete={actions.handleComplete}
            onReopen={actions.handleReopen}
            onEdit={actions.handleEdit}
            onDelete={actions.handleDelete}
          />
        ),
      },
    ],
    [actions],
  );

  return (
    <div className="space-y-4">
      <DeadlineSummaryCards deadlines={allDeadlines} />
      <TimelineToolbar
        filters={filters}
        yearOptions={yearOptions}
        onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
        onReset={() => setFilters({ status: "", type: "", year: "", overdueOnly: false })}
      />
      <DataTable
        data={displayData}
        columns={columns}
        getRowKey={(entry) => entry.id}
        isLoading={isLoading}
        rowClassName={getDeadlineRowClassName}
        emptyState={{
          icon: Inbox,
          title: "אין מועדים להצגה",
          message: "לא נמצאו מועדי מס ללקוח",
          variant: "illustration",
        }}
      />
      <EditTaxDeadlineFormModal
        open={Boolean(actions.editingDeadline)}
        onClose={() => actions.setEditingDeadline(null)}
        onSubmit={actions.onEditSubmit}
        form={actions.editForm}
        isSubmitting={actions.isUpdating}
      />
    </div>
  );
};

FilingTimeline.displayName = "FilingTimeline";
