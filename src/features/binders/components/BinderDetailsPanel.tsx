import { DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { MonoValue } from "../../../components/ui/MonoValue";
import type { BinderResponse } from "../types";
import {
  getStatusLabel,
  getSignalLabel,
} from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import {  BINDER_SIGNAL_VARIANTS, BINDER_STATUS_VARIANTS } from "../constants";

interface BinderDetailsPanelProps {
  binder: BinderResponse;
}

export const BinderDetailsPanel: React.FC<BinderDetailsPanelProps> = ({ binder }) => {
  return (
    <>
      <DrawerSection title="פרטי קלסר">
        <DrawerField label="מספר קלסר" value={binder.binder_number} />
        <DrawerField label="סטטוס" value={
          <StatusBadge status={binder.status} getLabel={getStatusLabel} variantMap={BINDER_STATUS_VARIANTS} />
        } />
        {binder.returned_at && (
          <DrawerField label="תאריך החזרה" value={formatDate(binder.returned_at)} />
        )}
        {binder.pickup_person_name && (
          <DrawerField label="נאסף על ידי" value={binder.pickup_person_name} />
        )}
        <DrawerField
          label="ימים במשרד"
          value={<MonoValue value={binder.days_in_office} format="days" />}
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
