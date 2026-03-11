import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Textarea } from "../../../components/ui/Textarea";
import type { AmendReportModalProps } from "../types";

export const AmendReportModal = ({
  open,
  reason,
  isPending,
  onReasonChange,
  onClose,
  onSubmit,
}: AmendReportModalProps) => {
  const trimmedReason = reason.trim();
  const showValidation = trimmedReason.length > 0 && trimmedReason.length < 10;

  return (
    <Modal
      open={open}
      title="תיקון דוח"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            isLoading={isPending}
            disabled={trimmedReason.length < 10}
          >
            שלח
          </Button>
        </div>
      }
    >
      <Textarea
        label="סיבת תיקון *"
        rows={4}
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="תאר את סיבת התיקון (לפחות 10 תווים)..."
      />
      {showValidation && <p className="mt-1 text-xs text-red-500">נדרשים לפחות 10 תווים</p>}
    </Modal>
  );
};
