import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { taxDeadlinesApi } from "../api";
import type { TimelineEntry } from "../api";
import { QK } from "../../../lib/queryKeys";
import { cn } from "../../../utils/utils";

interface FilingTimelineProps {
  clientId: number;
}

const STATUS_LABELS: Record<string, string> = {
  completed: "הושלם",
  overdue: "באיחור",
  pending: "ממתין",
};

const statusVariants: Record<string, string> = {
  completed: "bg-green-50 text-green-700 border-green-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-gray-50 text-gray-600 border-gray-200",
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "overdue") return <AlertTriangle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-gray-400" />;
};

const daysLabel = (entry: TimelineEntry): string => {
  if (entry.status === "completed") return "הושלם";
  if (entry.days_remaining < 0) return `פג לפני ${Math.abs(entry.days_remaining)} ימים`;
  if (entry.days_remaining === 0) return "היום";
  return `נותרו ${entry.days_remaining} ימים`;
};

const daysLabelClass = (entry: TimelineEntry): string => {
  if (entry.status === "completed") return "text-green-600";
  if (entry.days_remaining < 0) return "text-red-600 font-semibold";
  if (entry.days_remaining <= 7) return "text-amber-600 font-semibold";
  return "text-gray-500";
};

const sortByDate = (a: TimelineEntry, b: TimelineEntry) =>
  new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

export const FilingTimeline: React.FC<FilingTimelineProps> = ({ clientId }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.taxDeadlines.timeline(clientId),
    queryFn: () => taxDeadlinesApi.getTimeline(clientId),
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500 py-6 text-center">טוען מועדים...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">אין מועדי הגשה</p>;
  }

  const sorted = [...data].sort(sortByDate);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-right">
            <th className="px-4 py-3 font-medium text-gray-500 w-8" />
            <th className="px-4 py-3 font-medium text-gray-600">אבן דרך</th>
            <th className="px-4 py-3 font-medium text-gray-600">תאריך יעד</th>
            <th className="px-4 py-3 font-medium text-gray-600">סטטוס</th>
            <th className="px-4 py-3 font-medium text-gray-600">ימים</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((entry) => (
            <tr
              key={entry.id}
              className={cn(
                "transition-colors",
                entry.status === "overdue" && "bg-red-50/40",
                entry.status === "completed" && "bg-green-50/30",
              )}
            >
              <td className="px-4 py-3">
                <StatusIcon status={entry.status} />
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">{entry.milestone_label}</td>
              <td className="px-4 py-3 text-gray-600 tabular-nums">
                {new Date(entry.due_date).toLocaleDateString("he-IL")}
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  statusVariants[entry.status] ?? statusVariants.pending,
                )}>
                  {STATUS_LABELS[entry.status] ?? entry.status}
                </span>
              </td>
              <td className={cn("px-4 py-3 tabular-nums text-xs", daysLabelClass(entry))}>
                {daysLabel(entry)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

FilingTimeline.displayName = "FilingTimeline";
