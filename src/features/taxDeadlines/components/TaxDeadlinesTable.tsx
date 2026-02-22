import { Calendar, CheckCircle2, Inbox } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";
import {
  calculateDaysRemaining,
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../../../api/taxDeadlines.utils";
import { staggerDelay } from "../../../utils/animation";
import { formatDate, cn } from "../../../utils/utils";

interface TaxDeadlinesTableProps {
  deadlines: TaxDeadlineResponse[];
  onComplete: (id: number) => void;
  completingId: number | null;
  onRowClick?: (deadline: TaxDeadlineResponse) => void;
}

const urgencyRowMap: Record<string, string> = {
  overdue: "bg-red-50/40",
  red: "bg-orange-50/30",
  yellow: "bg-yellow-50/30",
};

export const TaxDeadlinesTable = ({
  deadlines,
  onComplete,
  completingId,
  onRowClick,
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
              {["לקוח", "סוג", "מועד", "זמן נותר", "סכום", "סטטוס", "פעולות"].map(
                (col) => (
                  <th
                    key={col}
                    className="pb-3 pr-4 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {deadlines.map((deadline, index) => {
              const daysRemaining = calculateDaysRemaining(deadline.due_date);
              const isCompleted = deadline.status === "completed";

              const urgency = isCompleted
                ? "green"
                : daysRemaining < 0
                ? "overdue"
                : daysRemaining <= 2
                ? "red"
                : daysRemaining <= 7
                ? "yellow"
                : "green";

              const daysLabel = isCompleted
                ? "—"
                : daysRemaining < 0
                ? `איחור ${Math.abs(daysRemaining)}י׳`
                : daysRemaining === 0
                ? "היום"
                : `${daysRemaining} ימים`;

              return (
                <tr
                  key={deadline.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50 animate-fade-in",
                    onRowClick && "cursor-pointer",
                    !isCompleted && urgencyRowMap[urgency]
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
                      <Badge
                        className={cn("border font-semibold text-xs", getUrgencyColor(urgency))}
                      >
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
                    {!isCompleted && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onComplete(deadline.id); }}
                        isLoading={completingId === deadline.id}
                        disabled={completingId !== null && completingId !== deadline.id}
                      >
                        סמן הושלם
                      </Button>
                    )}
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
