import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../actions/components/ConfirmDialog";
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
  const { actionLoading, charge, denied, runAction, isAdvisor, deleteCharge, isDeleting } = useChargeDetailsPage(
    chargeId != null ? String(chargeId) : undefined,
  );
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <>
    <ConfirmDialog
      open={isConfirmingDelete}
      title="מחיקת חיוב"
      message={charge ? `האם למחוק את חיוב #${charge.id}? פעולה זו אינה ניתנת לביטול.` : "האם למחוק את החיוב?"}
      confirmLabel="מחק חיוב"
      cancelLabel="ביטול"
      isLoading={isDeleting}
      onConfirm={async () => {
        await deleteCharge();
        setIsConfirmingDelete(false);
        onClose();
      }}
      onCancel={() => setIsConfirmingDelete(false)}
    />
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
              {charge.status === "draft" && (
                <div className="pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsConfirmingDelete(true)}
                    isLoading={isDeleting}
                    disabled={isDeleting || actionLoading}
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    מחק חיוב
                  </Button>
                </div>
              )}
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
    </>
  );
};