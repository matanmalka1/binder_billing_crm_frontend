import { useNavigate } from "react-router-dom";
import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/overlays/DetailDrawer";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Button } from "../../../components/ui/primitives/Button";
import { CheckCircle2 } from "lucide-react";
import type { TaxDeadlineResponse } from "../api";
import {
  formatCurrency,
  getDeadlineTypeLabel,
  getUrgencyColor,
} from "../api";
import { getDeadlineUrgency } from "../utils";
import { formatDate, cn } from "../../../utils/utils";
import { semanticMonoToneClasses } from "@/utils/semanticColors";

interface TaxDeadlineDrawerProps {
  deadline: TaxDeadlineResponse | null;
  onClose: () => void;
}

export const TaxDeadlineDrawer: React.FC<TaxDeadlineDrawerProps> = ({ deadline, onClose }) => {
  const navigate = useNavigate();
  const isCompleted = deadline?.status === "completed";
  const canViewAdvancePayments = deadline?.deadline_type === "advance_payment" && deadline.client_id != null;
  const { urgency, daysLabel } = deadline
    ? getDeadlineUrgency(deadline.due_date, isCompleted ?? false)
    : { urgency: "green" as const, daysLabel: "—" };

  return (
    <DetailDrawer
      open={deadline !== null}
      title={deadline ? getDeadlineTypeLabel(deadline.deadline_type) : ""}
      subtitle={deadline?.business_name ?? (deadline ? `עסק #${deadline.business_id}` : undefined)}
      onClose={onClose}
    >
      {deadline && (
        <>
          {canViewAdvancePayments && (
            <DrawerSection title="פעולות">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate(`/clients/${deadline.client_id}/advance-payments`);
                  onClose();
                }}
              >
                ראה תשלומי מקדמה
              </Button>
            </DrawerSection>
          )}

          <DrawerSection title="פרטי מועד">
            <DrawerField label="עסק" value={deadline.business_name ?? `#${deadline.business_id}`} />
            <DrawerField label="סוג מועד" value={getDeadlineTypeLabel(deadline.deadline_type)} />
            <DrawerField label="תאריך יעד" value={formatDate(deadline.due_date)} />
            <DrawerField
              label="סכום לתשלום"
              value={
                <span className="font-mono font-semibold">
                  {formatCurrency(deadline.payment_amount)}
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
                  <span className={cn("flex items-center gap-1 font-medium", semanticMonoToneClasses.positive)}>
                    <CheckCircle2 className="h-4 w-4" />
                    הושלם
                  </span>
                ) : (
                  <Badge variant="warning">ממתין</Badge>
                )
              }
            />
            {!isCompleted && (
              <DrawerField
                label="זמן נותר"
                value={
                  <Badge className={cn("font-semibold", getUrgencyColor(urgency))}>
                    {daysLabel}
                  </Badge>
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
