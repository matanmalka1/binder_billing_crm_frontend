import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import { getChargeAmountText, canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

const chargeTypeLabels: Record<string, string> = { one_time: "חד פעמי", retainer: "ריטיינר" };
const getChargeTypeLabel = (type: string) => chargeTypeLabels[type] ?? type;
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
              <div className="flex flex-wrap gap-2 py-2">
                {canIssue(charge.status) && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void runAction("issue")}
                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    הנפקה
                  </button>
                )}
                {canMarkPaid(charge.status) && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void runAction("markPaid")}
                    className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                  >
                    סימון שולם
                  </button>
                )}
                {canCancel(charge.status) && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void runAction("cancel")}
                    className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    ביטול
                  </button>
                )}
              </div>
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
  );
};
