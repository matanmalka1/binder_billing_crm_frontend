import {
  DrawerField,
  DrawerSection,
} from "../../../components/ui/overlays/DetailDrawer";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import { MonoValue } from "../../../components/ui/primitives/MonoValue";
import type { BinderResponse } from "../types";
import { getStatusLabel } from "../../../utils/enums";
import { formatDate, formatMonthYear } from "../../../utils/utils";
import { BINDER_STATUS_VARIANTS } from "../constants";

const formatPeriod = (start: string | null, end: string | null): string => {
  if (!start) return "—";
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : "פעיל"}`;
};

interface BinderDetailsPanelProps {
  binder: BinderResponse;
}

export const BinderDetailsPanel: React.FC<BinderDetailsPanelProps> = ({
  binder,
}) => {
  return (
    <>
      <DrawerSection title="פרטי קלסר">
        <DrawerField label="מספר קלסר" value={binder.binder_number} />
        {(binder.period_start != null || binder.period_end != null) && (
          <DrawerField
            label="תקופה"
            value={formatPeriod(binder.period_start, binder.period_end)}
          />
        )}
        <DrawerField
          label="סטטוס"
          value={
            <StatusBadge
              status={binder.status}
              getLabel={getStatusLabel}
              variantMap={BINDER_STATUS_VARIANTS}
            />
          }
        />
        {binder.returned_at && (
          <DrawerField
            label="תאריך החזרה"
            value={formatDate(binder.returned_at)}
          />
        )}
        {binder.pickup_person_name && (
          <DrawerField label="נאסף על ידי" value={binder.pickup_person_name} />
        )}
        <DrawerField
          label="ימים במשרד"
          value={<MonoValue value={binder.days_in_office} format="days" />}
        />
      </DrawerSection>
    </>
  );
};

BinderDetailsPanel.displayName = "BinderDetailsPanel";
