import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BinderResponse } from "../../../api/binders.types";
import {
  getStatusLabel,
  getWorkStateLabel,
  getSignalLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";
import { BINDER_WORK_STATE_VARIANTS, BINDER_SIGNAL_VARIANTS } from "../types";

interface BinderDrawerProps {
  open: boolean;
  binder: BinderResponse | null;
  onClose: () => void;
}

export const BinderDrawer: React.FC<BinderDrawerProps> = ({ open, binder, onClose }) => {
  const navigate = useNavigate();

  const handleOpenClient = () => {
    if (!binder) return;
    navigate(`/clients/${binder.client_id}`);
    onClose();
  };

  return (
    <DetailDrawer
      open={open}
      title={binder ? `קלסר ${binder.binder_number}` : ""}
      subtitle={binder?.client_name ?? (binder ? `לקוח #${binder.client_id}` : undefined)}
      onClose={onClose}
    >
      {binder && (
        <>
          <DrawerSection title="פעולות">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenClient}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              פתח כרטיס לקוח
            </Button>
          </DrawerSection>

          <DrawerSection title="פרטי קלסר">
            <DrawerField label="מספר קלסר" value={binder.binder_number} />
            <DrawerField label="סוג חומר" value={getBinderTypeLabel(binder.binder_type)} />
            <DrawerField label="סטטוס" value={getStatusLabel(binder.status)} />
            <DrawerField label="תאריך קבלה" value={formatDate(binder.received_at)} />
            {binder.returned_at && (
              <DrawerField label="תאריך החזרה" value={formatDate(binder.returned_at)} />
            )}
            {binder.pickup_person_name && (
              <DrawerField label="נאסף על ידי" value={binder.pickup_person_name} />
            )}
          </DrawerSection>

          <DrawerSection title="מצב עבודה">
            <DrawerField
              label="מצב"
              value={
                <Badge variant={BINDER_WORK_STATE_VARIANTS[binder.work_state ?? ""] ?? "neutral"}>
                  {getWorkStateLabel(binder.work_state ?? "")}
                </Badge>
              }
            />
            <DrawerField
              label="ימים במשרד"
              value={
                binder.days_in_office != null ? (
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      binder.days_in_office > 90
                        ? "text-red-700"
                        : binder.days_in_office > 60
                        ? "text-orange-600"
                        : "text-gray-900",
                    )}
                  >
                    {binder.days_in_office}
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </DrawerSection>

          {Array.isArray(binder.signals) && binder.signals.length > 0 && (
            <DrawerSection title="אותות">
              <div className="flex flex-wrap gap-1.5 py-3">
                {binder.signals.map((signal) => (
                  <Badge key={signal} variant={BINDER_SIGNAL_VARIANTS[signal] ?? "neutral"}>
                    {getSignalLabel(signal)}
                  </Badge>
                ))}
              </div>
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
  );
};
BinderDrawer.displayName = "BinderDrawer";