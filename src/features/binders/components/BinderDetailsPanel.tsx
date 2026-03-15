import { DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DaysDisplay } from "../../../components/ui/DaysDisplay";
import type { BinderResponse } from "../types";
import {
  getStatusLabel,
  getWorkStateLabel,
  getSignalLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { BINDER_WORK_STATE_VARIANTS, BINDER_SIGNAL_VARIANTS, BINDER_STATUS_VARIANTS } from "../constants";

interface BinderDetailsPanelProps {
  binder: BinderResponse;
}

export const BinderDetailsPanel: React.FC<BinderDetailsPanelProps> = ({ binder }) => {
  return (
    <>
      <DrawerSection title="פרטי קלסר">
        <DrawerField label="מספר קלסר" value={binder.binder_number} />
        <DrawerField label="סוג חומר" value={getBinderTypeLabel(binder.binder_type)} />
        <DrawerField label="סטטוס" value={
          <StatusBadge status={binder.status} getLabel={getStatusLabel} variantMap={BINDER_STATUS_VARIANTS} />
        } />
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
          value={<DaysDisplay days={binder.days_in_office} />}
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
