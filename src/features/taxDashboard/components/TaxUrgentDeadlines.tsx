import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { DeadlineUrgentItem } from "../../../api/taxDeadlines.api";
import {
  formatCurrency,
  getDeadlineIcon,
  getDeadlineTypeLabel,
  getUrgencyColor,
  getUrgencyLabel,
} from "../../../api/taxDeadlines.utils";
import { formatDate, cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

interface TaxUrgentDeadlinesProps {
  items: DeadlineUrgentItem[];
}

const urgencyBorderMap: Record<string, string> = {
  overdue: "border-r-4 border-r-red-600",
  red: "border-r-4 border-r-red-400",
  yellow: "border-r-4 border-r-yellow-400",
};

export const TaxUrgentDeadlines = ({ items }: TaxUrgentDeadlinesProps) => {
  return (
    <Card
      variant="elevated"
      title="מועדים דחופים"
      subtitle={
        items.length > 0
          ? `${items.length} מועדים דורשים תשומת לב מיידית`
          : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="הכל תחת שליטה"
          message="אין מועדים דחופים כרגע — כל המועדים במעקב תקין"
          variant="illustration"
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const daysText =
              item.days_remaining < 0
                ? `באיחור של ${Math.abs(item.days_remaining)} ימים`
                : item.days_remaining === 0
                ? "פג היום"
                : `נותרו ${item.days_remaining} ימים`;

            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-xl border border-gray-200 bg-white p-4",
                  "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  "animate-fade-in",
                  urgencyBorderMap[item.urgency] ?? "border-r-4 border-r-gray-300"
                )}
                style={{ animationDelay: staggerDelay(index) }}
              >
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl leading-none shrink-0">
                      {getDeadlineIcon(item.deadline_type)}
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-bold text-gray-900">
                        {item.client_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {getDeadlineTypeLabel(item.deadline_type)}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={cn("shrink-0 font-semibold border", getUrgencyColor(item.urgency))}
                  >
                    {getUrgencyLabel(item.urgency)}
                  </Badge>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <DeadlineMeta icon={<Calendar className="h-4 w-4 text-gray-400" />} label="מועד">
                    {formatDate(item.due_date)}
                  </DeadlineMeta>

                  <DeadlineMeta
                    icon={<AlertTriangle className="h-4 w-4 text-gray-400" />}
                    label="זמן נותר"
                  >
                    <span
                      className={cn(
                        "font-semibold",
                        item.days_remaining < 0
                          ? "text-red-600"
                          : item.days_remaining <= 2
                          ? "text-orange-600"
                          : "text-gray-900"
                      )}
                    >
                      {daysText}
                    </span>
                  </DeadlineMeta>

                  {item.payment_amount != null && (
                    <DeadlineMeta
                      icon={<span className="text-gray-400 text-base leading-none">₪</span>}
                      label="סכום"
                    >
                      {formatCurrency(item.payment_amount)}
                    </DeadlineMeta>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

TaxUrgentDeadlines.displayName = "TaxUrgentDeadlines";

/* ─── Sub-component ─────────────────────────────────────────────────── */

interface DeadlineMetaProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const DeadlineMeta: React.FC<DeadlineMetaProps> = ({ icon, label, children }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <div>
      <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 leading-tight">{children}</p>
    </div>
  </div>
);
DeadlineMeta.displayName = "DeadlineMeta";
