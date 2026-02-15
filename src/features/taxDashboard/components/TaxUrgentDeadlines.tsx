import { Calendar, AlertTriangle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { DeadlineUrgentItem } from "../../../api/taxDeadlines.api";
import {
  formatCurrency,
  getDeadlineIcon,
  getDeadlineTypeLabel,
  getUrgencyColor,
  getUrgencyLabel,
} from "../../../api/taxDeadlines.utils";
import { formatDate } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

interface Props {
  items: DeadlineUrgentItem[];
}

export const TaxUrgentDeadlines: React.FC<Props> = ({ items }) => {
  if (!items.length) {
    return (
      <Card variant="elevated" title="מועדים דחופים" subtitle="אין מועדים דחופים">
        <div className="py-12 text-center text-gray-500">כל המועדים במעקב תקין</div>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      title="מועדים דחופים"
      subtitle={`${items.length} מועדים דורשים תשומת לב מיידית`}
    >
      <div className="space-y-3">
        {items.map((item, index) => {
          const daysText =
            item.days_remaining < 0
              ? `באיחור של ${Math.abs(item.days_remaining)} ימים`
              : `נותרו ${item.days_remaining} ימים`;

          return (
            <div
              key={item.id}
              className={cn(
                "relative rounded-xl border-2 p-4 transition-all duration-200",
                "hover:shadow-lg hover:-translate-y-1 animate-fade-in"
              )}
              style={{ animationDelay: staggerDelay(index) }}
            >
              <div
                className={cn(
                  "absolute top-0 right-0 h-full w-2 rounded-r-lg",
                  item.urgency === "overdue" && "bg-red-600",
                  item.urgency === "red" && "bg-red-500",
                  item.urgency === "yellow" && "bg-yellow-500"
                )}
              />

              <div className="pr-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-2xl">{getDeadlineIcon(item.deadline_type)}</span>
                      <h4 className="text-lg font-bold text-gray-900">{item.client_name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getDeadlineTypeLabel(item.deadline_type)}
                    </p>
                  </div>

                  <Badge
                    className={cn("shrink-0 border-2 font-semibold", getUrgencyColor(item.urgency))}
                  >
                    {getUrgencyLabel(item.urgency)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                  <DeadlineMeta icon={<Calendar className="h-4 w-4 text-gray-400" />} label="מועד">
                    {formatDate(item.due_date)}
                  </DeadlineMeta>
                  <DeadlineMeta
                    icon={<AlertTriangle className="h-4 w-4 text-gray-400" />}
                    label="זמן נותר"
                  >
                    {daysText}
                  </DeadlineMeta>
                  {item.payment_amount && (
                    <DeadlineMeta icon={<span className="text-gray-400">💰</span>} label="סכום">
                      {formatCurrency(item.payment_amount)}
                    </DeadlineMeta>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

interface DeadlineMetaProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const DeadlineMeta: React.FC<DeadlineMetaProps> = ({ icon, label, children }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{children}</p>
    </div>
  </div>
);

const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");
