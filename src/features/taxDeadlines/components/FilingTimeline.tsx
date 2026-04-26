import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Inbox, ListChecks, RotateCcw, X } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { taxDeadlinesApi, taxDeadlinesQK, getDeadlineTypeLabel } from "../api";
import type { TaxDeadlineResponse } from "../api";
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_STATUS_OPTIONS,
} from "../constants";
import { getTaxDeadlinePeriodLabel } from "../utils";
import { formatCurrency } from "../api";
import { cn } from "../../../utils/utils";
import { useClientDeadlineActions } from "../hooks/useClientDeadlineActions";
import { TaxDeadlineRowActions } from "./TaxDeadlineRowActions";
import { EditTaxDeadlineFormModal } from "./EditTaxDeadlineForm";
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

const getSummary = (deadlines: TaxDeadlineResponse[]) => ({
  overdue: deadlines.filter((deadline) => deadline.status === "pending" && deadline.urgency_level === "overdue").length,
  pending: deadlines.filter((deadline) => deadline.status === "pending").length,
  completed: deadlines.filter((deadline) => deadline.status === "completed").length,
  totalOpen: deadlines
    .filter((deadline) => deadline.status === "pending" && deadline.payment_amount !== null)
    .reduce((sum, deadline) => sum + Number(deadline.payment_amount), 0),
});

const SummaryCard = ({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: "negative" | "warning" | "positive" | "neutral";
}) => {
  const tones = {
    negative: "border-negative-100 bg-negative-50 text-negative-700",
    warning: "border-warning-100 bg-warning-50 text-warning-700",
    positive: "border-positive-100 bg-positive-50 text-positive-700",
    neutral: "border-gray-100 bg-gray-50 text-gray-700",
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className={cn("mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md border", tones[tone])}>
        {icon}
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

const DeadlineSummaryCards = ({ deadlines }: { deadlines: TaxDeadlineResponse[] }) => {
  const summary = useMemo(() => getSummary(deadlines), [deadlines]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard label="באיחור" value={summary.overdue} icon={<AlertTriangle className="h-4 w-4" />} tone="negative" />
      <SummaryCard label="ממתינים" value={summary.pending} icon={<RotateCcw className="h-4 w-4" />} tone="warning" />
      <SummaryCard label="הושלמו" value={summary.completed} icon={<CheckCircle2 className="h-4 w-4" />} tone="positive" />
      <SummaryCard label="סכום פתוח" value={formatCurrency(String(summary.totalOpen))} icon={<ListChecks className="h-4 w-4" />} tone="neutral" />
    </div>
  );
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-end">
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
        <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={!hasFilters}>
          <X className="h-4 w-4" />
          ניקוי
        </Button>
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
