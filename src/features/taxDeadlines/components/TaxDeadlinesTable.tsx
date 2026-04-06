import { Calendar, CheckCircle2, Inbox } from "lucide-react";
import { IconLabel } from "../../../components/ui/primitives/IconLabel";
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { StateCard } from "../../../components/ui/feedback/StateCard";
import { TaxDeadlineRowActions } from "./TaxDeadlineRowActions";
import type { TaxDeadlineResponse } from "../api";
import {
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../api";
import { getDeadlineUrgency, getDeadlineDaysLabelShort } from "../utils";
import { staggerDelay } from "../../../utils/animation";
import { formatDate, cn } from "../../../utils/utils";

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

const urgencyRowMap: Record<string, string> = {
  overdue: "bg-negative-50/40",
  red: "bg-negative-50/30",
  yellow: "bg-warning-50/30",
};

const TABLE_HEADERS = ["עסק", "סוג", "מועד", "זמן נותר", "סכום", "סטטוס", ""];

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
  if (deadlines.length === 0) {
    return (
      <StateCard
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
                      {deadline.business_name ?? `#${deadline.business_id}`}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-gray-700">
                    {getDeadlineTypeLabel(deadline.deadline_type)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <IconLabel
                      icon={<Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                      label={formatDate(deadline.due_date)}
                      className="border-transparent bg-transparent font-medium text-gray-800 text-sm px-0 gap-1.5"
                    />
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
                    {formatCurrency(deadline.payment_amount)}
                  </td>
                  <td className="py-3.5 pr-4">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-positive-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">הושלם</span>
                      </div>
                    ) : (
                      <Badge variant="warning">ממתין</Badge>
                    )}
                  </td>
                  <td className="py-3.5 pr-4">
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
