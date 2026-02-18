import { CalendarClock } from "lucide-react";
import {
  calculateDaysRemaining,
  getDeadlineIcon,
  getDeadlineTypeLabel,
} from "../../../api/taxDeadlines.utils";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { formatDate, cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";

interface TaxUpcomingDeadlinesProps {
  items: TaxDeadlineResponse[];
}

TaxUpcomingDeadlines.displayName = "TaxUpcomingDeadlines";

export function TaxUpcomingDeadlines({ items }: TaxUpcomingDeadlinesProps) {
  return (
    <Card
      variant="elevated"
      title="מועדים קרובים"
      subtitle={
        items.length > 0
          ? `${items.length} מועדים ב-7 הימים הקרובים`
          : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          message="אין מועדים קרובים השבוע"
          variant="minimal"
        />
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 5).map((deadline, index) => {
            const daysRemaining = calculateDaysRemaining(deadline.due_date);
            const isUrgent = daysRemaining <= 2;

            return (
              <li
                key={deadline.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-3",
                  "transition-colors hover:bg-gray-50 animate-fade-in",
                  isUrgent
                    ? "border-orange-200 bg-orange-50/40"
                    : "border-gray-200 bg-white"
                )}
                style={{ animationDelay: staggerDelay(index) }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">
                    {getDeadlineIcon(deadline.deadline_type)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getDeadlineTypeLabel(deadline.deadline_type)}
                    </p>
                    <p className="text-xs text-gray-500">
                      לקוח #{deadline.client_id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(deadline.due_date)}
                  </p>
                  <Badge variant={isUrgent ? "warning" : "info"}>
                    {daysRemaining === 0
                      ? "היום"
                      : `${daysRemaining} ימים`}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}