import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { taxDeadlinesApi, taxDeadlinesQK, getDeadlineTypeLabel } from "../api";
import type { TimelineEntry } from "../api";
import {
  DeadlineAmountCell,
  DeadlineDateCell,
  DeadlineStatusBadge,
  DeadlineUrgencyBadge,
  getDeadlineRowClassName,
} from "./TaxDeadlineTableParts";

interface FilingTimelineProps {
  clientId: number;
}

const sortByDate = (a: TimelineEntry, b: TimelineEntry) =>
  new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

export const FilingTimeline: React.FC<FilingTimelineProps> = ({ clientId }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: taxDeadlinesQK.timeline(clientId),
    queryFn: () => taxDeadlinesApi.getTimeline(clientId),
  });

  const sorted = useMemo(() => [...data].sort(sortByDate), [data]);

  const columns = useMemo<Column<TimelineEntry>[]>(
    () => [
      {
        key: "deadline_type",
        header: "סוג",
        render: (entry) => (
          <div>
            <span className="block text-sm font-semibold text-gray-900">
              {getDeadlineTypeLabel(entry.deadline_type)}
            </span>
            <span className="block max-w-[260px] truncate text-xs text-gray-400">
              {entry.milestone_label}
            </span>
          </div>
        ),
      },
      {
        key: "period",
        header: "תקופה",
        render: (entry) => (
          <span className="text-sm text-gray-500">{entry.period || "—"}</span>
        ),
      },
      {
        key: "due_date",
        header: "מועד",
        render: (entry) => <DeadlineDateCell dueDate={entry.due_date} />,
      },
      {
        key: "urgency",
        header: "דחיפות",
        render: (entry) => <DeadlineUrgencyBadge deadline={entry} />,
      },
      {
        key: "payment_amount",
        header: "סכום",
        render: (entry) => <DeadlineAmountCell amount={entry.payment_amount} />,
      },
      {
        key: "status",
        header: "סטטוס",
        render: (entry) => <DeadlineStatusBadge status={entry.status} />,
      },
    ],
    [],
  );

  return (
    <DataTable
      data={sorted}
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
  );
};

FilingTimeline.displayName = "FilingTimeline";

