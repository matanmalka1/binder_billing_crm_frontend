import { useNavigate } from "react-router-dom";
import { getYear } from "date-fns";
import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";
import {
  calculateDaysRemaining,
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../../../api/taxDeadlines.utils";
import { formatDate, cn } from "../../../utils/utils";

interface TaxDeadlineDrawerProps {
  deadline: TaxDeadlineResponse | null;
  onClose: () => void;
}

export const TaxDeadlineDrawer: React.FC<TaxDeadlineDrawerProps> = ({ deadline, onClose }) => {
  const navigate = useNavigate();
  const isCompleted = deadline?.status === "completed";

  const daysRemaining = deadline && !isCompleted
    ? calculateDaysRemaining(deadline.due_date)
    : null;

  const urgency = isCompleted
    ? "green"
    : daysRemaining == null
    ? "green"
    : daysRemaining < 0
    ? "overdue"
    : daysRemaining <= 2
    ? "red"
    : daysRemaining <= 7
    ? "yellow"
    : "green";

  const daysLabel =
    daysRemaining == null
      ? "—"
      : daysRemaining < 0
      ? `איחור של ${Math.abs(daysRemaining)} ימים`
      : daysRemaining === 0
      ? "היום"
      : `${daysRemaining} ימים`;

  return (
    <DetailDrawer
      open={deadline !== null}
      title={deadline ? getDeadlineTypeLabel(deadline.deadline_type) : ""}
      subtitle={deadline?.client_name ?? (deadline ? `לקוח #${deadline.client_id}` : undefined)}
      onClose={onClose}
    >
      {deadline && (
        <>
          <DrawerSection title="פעולות">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const year = getYear(new Date(deadline.due_date));
                navigate(`/tax/advance-payments?client_id=${deadline.client_id}&year=${year}`);
                onClose();
              }}
            >
              ראה תשלומי מקדמה
            </Button>
          </DrawerSection>

          <DrawerSection title="פרטי מועד">
            <DrawerField label="לקוח" value={deadline.client_name ?? `#${deadline.client_id}`} />
            <DrawerField label="סוג מועד" value={getDeadlineTypeLabel(deadline.deadline_type)} />
            <DrawerField label="תאריך יעד" value={formatDate(deadline.due_date)} />
            <DrawerField
              label="סכום לתשלום"
              value={
                <span className="font-mono font-semibold">
                  {formatCurrency(deadline.payment_amount, deadline.currency)}
                </span>
              }
            />
            {deadline.description && (
              <DrawerField label="תיאור" value={deadline.description} />
            )}
          </DrawerSection>

          <DrawerSection title="סטטוס">
            <DrawerField
              label="מצב"
              value={
                isCompleted ? (
                  <span className="flex items-center gap-1 text-green-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    הושלם
                  </span>
                ) : (
                  <Badge variant="warning">ממתין</Badge>
                )
              }
            />
            {!isCompleted && daysRemaining !== null && (
              <DrawerField
                label="זמן נותר"
                value={
                  <span className={cn("font-semibold text-sm", getUrgencyColor(urgency), "px-2 py-0.5 rounded-full border text-xs")}>
                    {daysLabel}
                  </span>
                }
              />
            )}
            {isCompleted && deadline.completed_at && (
              <DrawerField label="הושלם בתאריך" value={formatDate(deadline.completed_at)} />
            )}
            <DrawerField label="נוצר בתאריך" value={formatDate(deadline.created_at)} />
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
};
TaxDeadlineDrawer.displayName = "TaxDeadlineDrawer";
