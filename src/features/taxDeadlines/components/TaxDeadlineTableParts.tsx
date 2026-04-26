import { AlertTriangle, Calendar, Clock3 } from "lucide-react";
import { Badge } from "../../../components/ui/primitives/Badge";
import { IconLabel } from "../../../components/ui/primitives/IconLabel";
import { calculateDaysRemaining, formatCurrency, getUrgencyColor } from "../api";
import type { DeadlineUrgencyLevel } from "../api";
import { getDeadlineDaysLabelShort } from "../utils";
import { cn, formatDate } from "../../../utils/utils";

interface DeadlineDisplayFields {
  due_date: string;
  status: string;
  payment_amount: string | null;
  urgency_level: DeadlineUrgencyLevel;
}

export const DeadlineStatusBadge = ({ status }: { status: string }) => {
  if (status === "completed") return <Badge variant="success">הושלם</Badge>;
  if (status === "canceled") return <Badge variant="neutral">בוטל</Badge>;
  return <Badge variant="warning">ממתין</Badge>;
};

export const DeadlineDateCell = ({ dueDate }: { dueDate: string }) => (
  <IconLabel
    icon={<Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
    label={formatDate(dueDate)}
    className="border-transparent bg-transparent px-0 text-sm font-medium text-gray-700"
  />
);

export const DeadlineUrgencyBadge = ({ deadline }: { deadline: DeadlineDisplayFields }) => {
  const daysRemaining = calculateDaysRemaining(deadline.due_date);

  if (deadline.urgency_level === "none") return <span className="text-sm text-gray-400">—</span>;

  const Icon = deadline.urgency_level === "overdue" || deadline.urgency_level === "critical"
    ? AlertTriangle
    : Clock3;

  return (
    <Badge className={cn("inline-flex items-center gap-1 border text-xs font-semibold", getUrgencyColor(deadline.urgency_level))}>
      <Icon className="h-3.5 w-3.5" />
      {getDeadlineDaysLabelShort(daysRemaining, false)}
    </Badge>
  );
};

export const DeadlineAmountCell = ({
  amount,
  status,
}: {
  amount: string | null;
  status: string;
}) => {
  if (amount === null && status === "pending") {
    return <span className="text-sm italic text-gray-400">טרם חושב</span>;
  }
  return <span className="text-sm font-medium text-gray-700">{formatCurrency(amount)}</span>;
};
