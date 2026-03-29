import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { vatReportsApi } from "../api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { vatReportsQK } from "../api/queryKeys";
import { VAT_FILING_METHOD_LABELS } from "../constants";

interface VatFileModalProps {
  open: boolean;
  workItemId: number;
  onClose: () => void;
}

const FILING_METHODS = ["online", "manual"] as const;

export const VatFileModal: React.FC<VatFileModalProps> = ({ open, workItemId, onClose }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [filingMethod, setFilingMethod] = useState<"online" | "manual">("online");
  const [submissionReference, setSubmissionReference] = useState("");
  const [isAmendment, setIsAmendment] = useState(false);
  const [amendsItemId, setAmendsItemId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setFilingMethod("online");
    setSubmissionReference("");
    setIsAmendment(false);
    setAmendsItemId("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    if (isAmendment && amendsItemId && isNaN(Number(amendsItemId))) {
      setError("מזהה ההגשה המקורית חייב להיות מספר");
      return;
    }
    setIsLoading(true);
    try {
      await vatReportsApi.fileVatReturn(workItemId, {
        submission_method: filingMethod,
        submission_reference: submissionReference.trim() || undefined,
        is_amendment: isAmendment,
        amends_item_id: isAmendment && amendsItemId ? Number(amendsItemId) : null,
      });
      toast.success("התיק הוגש בהצלחה");
      await queryClient.invalidateQueries({ queryKey: vatReportsQK.detail(workItemId) });
      await queryClient.invalidateQueries({ queryKey: vatReportsQK.all });
      handleClose();
    } catch (err) {
      showErrorToast(err, "שגיאה בהגשה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title='הגשת דוח מע"מ'
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            ביטול
          </Button>
          <Button type="button" isLoading={isLoading} onClick={() => void handleSubmit()}>
            הגש
          </Button>
        </div>
      }
    >
      <div className="space-y-4" dir="rtl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">אופן הגשה</label>
          <SelectDropdown
            value={filingMethod}
            onChange={(e) => setFilingMethod(e.target.value as "online" | "manual")}
            options={FILING_METHODS.map((m) => ({ value: m, label: VAT_FILING_METHOD_LABELS[m] }))}
          />
        </div>

        <Input
          label="מספר אסמכתא (לא חובה)"
          placeholder="מספר אסמכתא מרשות המסים"
          value={submissionReference}
          onChange={(e) => setSubmissionReference(e.target.value)}
        />

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600"
            checked={isAmendment}
            onChange={(e) => setIsAmendment(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">תיקון להגשה קודמת</span>
        </label>

        {isAmendment && (
          <Input
            label="מזהה ההגשה המקורית"
            type="number"
            min={1}
            placeholder="מזהה תיק מע״מ מקורי"
            value={amendsItemId}
            onChange={(e) => setAmendsItemId(e.target.value)}
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
};

VatFileModal.displayName = "VatFileModal";
