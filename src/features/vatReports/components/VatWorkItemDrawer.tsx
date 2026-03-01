import { useState } from "react";
import {
  DetailDrawer,
  DrawerField,
  DrawerSection,
} from "../../../components/ui/DetailDrawer";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { CategoryDataEntryForm } from "./CategoryDataEntryForm";
import { useVatWorkItemDetail } from "../hooks/useVatWorkItemDetail";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatDateTime } from "../../../utils/utils";
import { formatVatAmount, canAddInvoice, canSendBack } from "../utils/vatWorkItemStatus";
import { useRole } from "../../../hooks/useRole";

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

interface VatWorkItemDrawerProps {
  item: VatWorkItemResponse | null;
  onClose: () => void;
  onSendBack?: (itemId: number, note: string) => Promise<void>;
}

export const VatWorkItemDrawer: React.FC<VatWorkItemDrawerProps> = ({
  item,
  onClose,
  onSendBack,
}) => {
  const { isAdvisor } = useRole();
  const [sendBackNote, setSendBackNote] = useState("");
  const [sendingBack, setSendingBack] = useState(false);
  const [showSendBackForm, setShowSendBackForm] = useState(false);

  const { summary, loading: summaryLoading } = useVatWorkItemDetail(item?.id ?? null);

  const handleSendBack = async () => {
    if (!item || !sendBackNote.trim()) return;
    setSendingBack(true);
    try {
      await onSendBack?.(item.id, sendBackNote.trim());
      setSendBackNote("");
      setShowSendBackForm(false);
    } finally {
      setSendingBack(false);
    }
  };

  const handleClose = () => {
    setShowSendBackForm(false);
    setSendBackNote("");
    onClose();
  };

  return (
    <DetailDrawer
      open={item !== null}
      title={item ? `תיק מע"מ #${item.id}` : ""}
      subtitle={item?.client_name ?? undefined}
      onClose={handleClose}
    >
      {item && (
        <>
          <DrawerSection title="פרטי תיק">
            <DrawerField label="לקוח" value={item.client_name ?? `#${item.client_id}`} />
            <DrawerField label="תקופה" value={<span className="font-mono">{item.period}</span>} />
            <DrawerField
              label="סטטוס"
              value={
                <StatusBadge
                  status={item.status}
                  getLabel={getVatWorkItemStatusLabel}
                  variantMap={statusVariants}
                />
              }
            />
            <DrawerField label="עדכון אחרון" value={formatDateTime(item.updated_at)} />
            {item.pending_materials_note && (
              <DrawerField label="הערה לחומרים" value={item.pending_materials_note} />
            )}
          </DrawerSection>

          <DrawerSection title='סיכום מע"מ'>
            {summaryLoading ? (
              <p className="py-2 text-sm text-gray-400">טוען...</p>
            ) : (
              <>
                <DrawerField
                  label="מע״מ עסקאות"
                  value={formatVatAmount(summary.totalOutputVat)}
                />
                <DrawerField
                  label="מע״מ תשומות"
                  value={formatVatAmount(summary.totalInputVat)}
                />
                <DrawerField
                  label='מע"מ נטו'
                  value={
                    <span className="font-semibold">
                      {formatVatAmount(item.net_vat)}
                    </span>
                  }
                />
                {item.final_vat_amount !== null && (
                  <DrawerField
                    label="סכום סופי"
                    value={formatVatAmount(item.final_vat_amount)}
                  />
                )}
              </>
            )}
          </DrawerSection>

          {canAddInvoice(item.status) && (
            <DrawerSection title="הקלדת נתונים">
              <div className="pt-2">
                <CategoryDataEntryForm
                  workItemId={item.id}
                  period={item.period}
                  onSaved={() => {}}
                />
              </div>
            </DrawerSection>
          )}

          {isAdvisor && canSendBack(item.status) && onSendBack && (
            <DrawerSection title="החזרה לתיקון">
              {showSendBackForm ? (
                <div className="space-y-2 py-2">
                  <textarea
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="הסבר מה יש לתקן..."
                    value={sendBackNote}
                    onChange={(e) => setSendBackNote(e.target.value)}
                    dir="rtl"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSendBackForm(false)}
                    >
                      ביטול
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      isLoading={sendingBack}
                      disabled={!sendBackNote.trim()}
                      onClick={handleSendBack}
                    >
                      החזר לתיקון
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSendBackForm(true)}
                    className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    החזר לתיקון
                  </Button>
                </div>
              )}
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
  );
};

VatWorkItemDrawer.displayName = "VatWorkItemDrawer";