import { Calendar, CheckCircle2, Inbox, Edit2, Trash2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";
import {
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../../../api/taxDeadlines.utils";
import { getDeadlineUrgency, getDeadlineDaysLabelShort } from "../utils/deadlineUrgency";
import { staggerDelay } from "../../../utils/animation";
import { formatDate, cn } from "../../../utils/utils";

interface TaxDeadlinesTableProps {
  deadlines: TaxDeadlineResponse[];
  onComplete: (id: number) => void;
  completingId: number | null;
  onRowClick?: (deadline: TaxDeadlineResponse) => void;
  onEdit?: (deadline: TaxDeadlineResponse) => void;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
}

const urgencyRowMap: Record<string, string> = {
  overdue: "bg-red-50/40",
  red: "bg-orange-50/30",
  yellow: "bg-yellow-50/30",
};

const TABLE_HEADERS = ["לקוח", "סוג", "מועד", "זמן נותר", "סכום", "סטטוס", "פעולות"];

export const TaxDeadlinesTable = ({
  deadlines,
  onComplete,
  completingId,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: TaxDeadlinesTableProps) => {
  if (deadlines.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="אין מועדים להצגה"
        message="לא נמצאו מועדים מסים התואמים לסינון הנוכחי"
        variant="illustration"
      />
    );
  }

  return (
    <Card variant="elevated">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200 text-right">
              {TABLE_HEADERS.map((col) => (
                <th
                  key={col}
                  className="pb-3 pr-4 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {deadlines.map((deadline, index) => {
              const isCompleted = deadline.status === "completed";
              const { urgency, daysRemaining } = getDeadlineUrgency(deadline.due_date, isCompleted);
              const daysLabel = getDeadlineDaysLabelShort(daysRemaining, isCompleted);

              return (
                <tr
                  key={deadline.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50 animate-fade-in",
                    onRowClick && "cursor-pointer",
                    !isCompleted && urgencyRowMap[urgency],
                  )}
                  style={{ animationDelay: staggerDelay(index) }}
                  onClick={() => onRowClick?.(deadline)}
                >
                  <td className="py-3.5 pr-4">
                    <span className="font-mono text-sm font-semibold text-gray-800">
                      #{deadline.client_id}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-gray-700">
                    {getDeadlineTypeLabel(deadline.deadline_type)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {formatDate(deadline.due_date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    {isCompleted ? (
                      <span className="text-sm text-gray-400">—</span>
                    ) : (
                      <Badge className={cn("border font-semibold text-xs", getUrgencyColor(urgency))}>
                        {daysLabel}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-sm font-medium text-gray-800">
                    {formatCurrency(deadline.payment_amount, deadline.currency)}
                  </td>
                  <td className="py-3.5 pr-4">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">הושלם</span>
                      </div>
                    ) : (
                      <Badge variant="warning">ממתין</Badge>
                    )}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isCompleted && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onComplete(deadline.id)}
                          isLoading={completingId === deadline.id}
                          disabled={completingId !== null && completingId !== deadline.id}
                        >
                          סמן הושלם
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(deadline)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          isLoading={deletingId === deadline.id}
                          onClick={() => onDelete(deadline.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

TaxDeadlinesTable.displayName = "TaxDeadlinesTable";
