import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import {
  getChargeAmountText,
  getChargeTypeLabel,
} from "../utils/chargeStatus";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";
import { ChargeActionButtons } from "./ChargeActionButtons";
import { useChargeDetailsPage } from "../hooks/useChargeDetailsPage";

interface ChargeDetailDrawerProps {
  chargeId: number | null;
  onClose: () => void;
}

export const ChargeDetailDrawer: React.FC<ChargeDetailDrawerProps> = ({ chargeId, onClose }) => {
  const { actionLoading, charge, denied, runAction, isAdvisor } = useChargeDetailsPage(
    chargeId != null ? String(chargeId) : undefined,
  );

  return (
    <DetailDrawer
      open={chargeId !== null}
      title={charge ? `חיוב #${charge.id}` : "פירוט חיוב"}
      subtitle={charge?.client_name ?? (charge ? `לקוח #${charge.client_id}` : undefined)}
      onClose={onClose}
    >
      {denied && (
        <AccessBanner variant="warning" message="אין לך הרשאה לבצע פעולה זו" />
      )}

      {charge && (
        <>
          <DrawerSection title="פרטים">
            <DrawerField label="מזהה" value={`#${charge.id}`} />
            <DrawerField label="לקוח" value={charge.client_name ?? `#${charge.client_id}`} />
            <DrawerField label="סוג" value={getChargeTypeLabel(charge.charge_type)} />
            <DrawerField label="סטטוס" value={getChargeStatusLabel(charge.status)} />
            <DrawerField label="סכום" value={getChargeAmountText(charge)} />
            <DrawerField label="תקופה" value={charge.period ?? "—"} />
            <DrawerField label="נוצר" value={formatDateTime(charge.created_at)} />
            <DrawerField label="הונפק" value={formatDateTime(charge.issued_at)} />
            <DrawerField label="שולם" value={formatDateTime(charge.paid_at)} />
          </DrawerSection>

          {isAdvisor && (
            <DrawerSection title="פעולות">
              <ChargeActionButtons
                status={charge.status}
                disabled={actionLoading}
                size="sm"
                onIssue={() => void runAction("issue")}
                onMarkPaid={() => void runAction("markPaid")}
                onCancel={() => void runAction("cancel")}
              />
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
  );
};