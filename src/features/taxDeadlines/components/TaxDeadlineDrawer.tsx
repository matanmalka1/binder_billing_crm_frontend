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
import { getDeadlineDaysLabel, getTaxDeadlinePeriodLabel } from "../utils";
import { formatDate, cn } from "../../../utils/utils";
import { semanticMonoToneClasses } from "@/utils/semanticColors";

interface TaxDeadlineDrawerProps {
  deadline: TaxDeadlineResponse | null;
  onClose: () => void;
}

export const TaxDeadlineDrawer: React.FC<TaxDeadlineDrawerProps> = ({ deadline, onClose }) => {
  const navigate = useNavigate();
  const isCompleted = deadline?.status === "completed";
  const isCanceled = deadline?.status === "canceled";
  const canViewAdvancePayments = deadline?.deadline_type === "advance_payment" && deadline.client_record_id != null;
  const canViewVat = deadline?.deadline_type === "vat" && deadline.client_record_id != null;
  const canViewAnnualReport = deadline?.deadline_type === "annual_report" && deadline.client_record_id != null;
  const hasSourceLink = canViewAdvancePayments || canViewVat || canViewAnnualReport;
  const { daysLabel } = deadline
    ? getDeadlineDaysLabel(deadline.due_date, Boolean(isCompleted || isCanceled))
    : { daysLabel: "—" };

  return (
    <DetailDrawer
      open={deadline !== null}
      title={deadline ? getDeadlineTypeLabel(deadline.deadline_type) : ""}
      subtitle={deadline?.client_name ?? (deadline ? `לקוח #${deadline.client_record_id}` : undefined)}
      onClose={onClose}
    >
      {deadline && (
        <>
          {hasSourceLink && (
            <DrawerSection title="קישור למקור">
              {canViewAdvancePayments && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { navigate(`/clients/${deadline.client_record_id}/advance-payments`); onClose(); }}
                >
                  פתח מקדמות
                </Button>
              )}
              {canViewVat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { navigate(`/clients/${deadline.client_record_id}/vat`); onClose(); }}
                >
                  פתח דוח מע״מ
                </Button>
              )}
              {canViewAnnualReport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { navigate(`/clients/${deadline.client_record_id}/annual-reports`); onClose(); }}
                >
                  פתח דוח שנתי
                </Button>
              )}
            </DrawerSection>
          )}

          <DrawerSection title="פרטי מועד">
            <DrawerField label="לקוח" value={deadline.client_name ?? `#${deadline.client_record_id}`} />
            <DrawerField label="סוג מועד" value={getDeadlineTypeLabel(deadline.deadline_type)} />
            <DrawerField label="תקופה" value={getTaxDeadlinePeriodLabel(deadline)} />
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
                ) : isCanceled ? (
                  <Badge variant="neutral">בוטל</Badge>
                ) : (
                  <Badge variant="warning">ממתין</Badge>
                )
              }
            />
            {deadline.urgency_level !== "none" && (
              <DrawerField
                label="זמן נותר"
                value={
                  <Badge className={cn("font-semibold", getUrgencyColor(deadline.urgency_level))}>
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
