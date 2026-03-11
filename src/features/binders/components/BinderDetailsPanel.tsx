import { DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import type { BinderResponse } from "../types";
import {
  getStatusLabel,
  getWorkStateLabel,
  getSignalLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";
import { BINDER_WORK_STATE_VARIANTS, BINDER_SIGNAL_VARIANTS } from "../constants";

interface BinderDetailsPanelProps {
  binder: BinderResponse;
}

export const BinderDetailsPanel: React.FC<BinderDetailsPanelProps> = ({ binder }) => {
  return (
    <>
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
        <DrawerField
          label="מצב עבודה"
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
  );
};

BinderDetailsPanel.displayName = "BinderDetailsPanel";
