import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/overlays/DetailDrawer";
import { Alert } from "../../../components/ui/overlays/Alert";
import { Button } from "../../../components/ui/primitives/Button";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import {
  getChargeAmountText,
  getChargePeriodLabel,
  getChargeTypeLabel,
} from "../utils";
import { formatDateTime } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";
import { ChargeActionButtons } from "./ChargeActionButtons";
import { useChargeDetailsPage } from "../hooks/useChargeDetailsPage";
import { chargeStatusVariants } from "../constants";

interface ChargeDetailDrawerProps {
  chargeId: number | null;
  onClose: () => void;
}

export const ChargeDetailDrawer: React.FC<ChargeDetailDrawerProps> = ({ chargeId, onClose }) => {
  const { actionLoading, charge, denied, runAction, isAdvisor, deleteCharge, isDeleting } = useChargeDetailsPage(
    chargeId != null ? String(chargeId) : undefined,
  );
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const footer = charge && isAdvisor ? (
    <div className="flex items-center justify-between gap-3">
      <ChargeActionButtons
        status={charge.status}
        disabled={actionLoading}
        size="sm"
        onIssue={() => void runAction("issue")}
        onMarkPaid={() => void runAction("markPaid")}
        onCancel={() => setIsConfirmingCancel(true)}
      />
      {charge.status === "draft" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsConfirmingDelete(true)}
          isLoading={isDeleting}
          disabled={isDeleting || actionLoading}
          className="gap-1.5 text-negative-600 border-negative-200 hover:bg-negative-50 shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
          מחק
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <>
      <ConfirmDialog
        open={isConfirmingCancel}
        title="ביטול חיוב"
        message={charge ? `האם לבטל את חיוב #${charge.id}?` : "האם לבטל את החיוב?"}
        confirmLabel="בטל חיוב"
        cancelLabel="חזור"
        isLoading={actionLoading}
        onConfirm={async () => {
          await runAction("cancel", cancelReason || undefined);
          setIsConfirmingCancel(false);
          setCancelReason("");
        }}
        onCancel={() => { setIsConfirmingCancel(false); setCancelReason(""); }}
      >
        <textarea
          className="mt-3 w-full rounded border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="סיבת ביטול (אופציונלי)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </ConfirmDialog>

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
        subtitle={
          charge ? (
            <span className="inline-flex items-center gap-2 flex-wrap">
              <Link
                to={`/clients/${charge.client_id ?? charge.business_id}`}
                className="text-primary-600 hover:underline"
                onClick={onClose}
              >
                {charge.business_name ?? `עסק #${charge.business_id}`}
              </Link>
              <StatusBadge
                status={charge.status}
                getLabel={getChargeStatusLabel}
                variantMap={chargeStatusVariants}
              />
            </span>
          ) : undefined
        }
        onClose={onClose}
        footer={footer}
      >
        {denied && (
          <Alert variant="warning" message="אין לך הרשאה לבצע פעולה זו" />
        )}

        {charge && (
          <DrawerSection title="פרטים">
            <DrawerField
              label="עסק"
              value={
                charge.business_name ? (
                  <Link
                    to={`/clients/${charge.client_id ?? charge.business_id}`}
                    className="text-primary-600 hover:underline"
                    onClick={onClose}
                  >
                    {charge.business_name}
                  </Link>
                ) : (
                  `עסק #${charge.business_id}`
                )
              }
            />
            <DrawerField label="סוג" value={getChargeTypeLabel(charge.charge_type)} />
            {charge.amount != null && (
              <DrawerField
                label="סכום"
                value={<span className="font-semibold text-gray-900">{getChargeAmountText(charge)}</span>}
              />
            )}
            <DrawerField label="תקופה" value={getChargePeriodLabel(charge.period, charge.months_covered)} />
            <DrawerField label="נוצר" value={formatDateTime(charge.created_at)} />
            <DrawerField label="הונפק" value={formatDateTime(charge.issued_at)} />
            <DrawerField label="שולם" value={formatDateTime(charge.paid_at)} />
          </DrawerSection>
        )}
      </DetailDrawer>
    </>
  );
};
