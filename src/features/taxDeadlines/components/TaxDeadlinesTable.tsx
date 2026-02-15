import { Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";
import {
  calculateDaysRemaining,
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../../../api/taxDeadlines.utils";
import { staggerDelay } from "../../../utils/animation";
import { formatDate } from "../../../utils/utils";

interface Props {
  deadlines: TaxDeadlineResponse[];
  onComplete: (id: number) => void;
  completingId: number | null;
}

export const TaxDeadlinesTable: React.FC<Props> = ({
  deadlines,
  onComplete,
  completingId,
}) => {
  if (deadlines.length === 0) {
    return (
      <Card variant="elevated">
        <div className="py-12 text-center text-gray-500">אין מועדים להצגה</div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr className="text-right border-b-2 border-gray-200">
              <th className="pb-4 pr-6 pt-4 text-sm font-semibold text-gray-700">
                לקוח
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סוג
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מועד
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                זמן נותר
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סכום
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סטטוס
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deadlines.map((deadline, index) => {
              const daysRemaining = calculateDaysRemaining(deadline.due_date);
              const urgency =
                deadline.status === "completed"
                  ? "completed"
                  : daysRemaining < 0
                    ? "overdue"
                    : daysRemaining <= 2
                      ? "red"
                      : daysRemaining <= 7
                        ? "yellow"
                        : "green";

              return (
                <tr
                  key={deadline.id}
                  className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent animate-fade-in"
                  style={{ animationDelay: staggerDelay(index) }}
                >
                  <td className="py-4 pr-6">
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      לקוח #{deadline.client_id}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {getDeadlineTypeLabel(deadline.deadline_type)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(deadline.due_date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    {deadline.status === "completed" ? (
                      <Badge variant="success">הושלם</Badge>
                    ) : (
                      <Badge
                        className={cn("border-2", getUrgencyColor(urgency))}
                      >
                        {daysRemaining < 0
                          ? `איחור ${Math.abs(daysRemaining)}י`
                          : `${daysRemaining}י`}
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(
                        deadline.payment_amount,
                        deadline.currency,
                      )}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    {deadline.status === "completed" ? (
                      <Badge variant="success">
                        <CheckCircle2 className="h-3 w-3 inline ml-1" />
                        הושלם
                      </Badge>
                    ) : (
                      <Badge variant="warning">ממתין</Badge>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {deadline.status === "pending" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onComplete(deadline.id)}
                        isLoading={completingId === deadline.id}
                        disabled={completingId !== null}
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

const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};
