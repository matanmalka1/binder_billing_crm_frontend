import { calculateDaysRemaining, getDeadlineIcon, getDeadlineTypeLabel } from "../../../api/taxDeadlines.utils";
import { Card } from "../../../components/ui/Card";
import { formatDate } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";

interface Props {
  items: TaxDeadlineResponse[];
}

export const TaxUpcomingDeadlines: React.FC<Props> = ({ items }) => {
  if (!items.length) return null;

  return (
    <Card
      variant="elevated"
      title="מועדים קרובים"
      subtitle={`${items.length} מועדים ב-7 הימים הקרובים`}
    >
      <div className="space-y-2">
        {items.slice(0, 5).map((deadline, index) => (
          <div
            key={deadline.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
            style={{ animationDelay: staggerDelay(index) }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getDeadlineIcon(deadline.deadline_type)}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getDeadlineTypeLabel(deadline.deadline_type)}
                </p>
                <p className="text-xs text-gray-500">לקוח #{deadline.client_id}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{formatDate(deadline.due_date)}</p>
              <p className="text-xs text-gray-500">{calculateDaysRemaining(deadline.due_date)} ימים</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
