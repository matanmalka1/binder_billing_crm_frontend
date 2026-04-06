import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { ADVANCE_PAYMENT_STATUS_OPTIONS } from "../constants";

interface EditAdvancePaymentInlineProps {
  row: AdvancePaymentRow;
  isUpdating: boolean;
  onSave: (paid_amount: string | null, status: AdvancePaymentStatus, expected_amount: string | null) => void;
  onCancel?: () => void;
}

export const EditAdvancePaymentInline: React.FC<EditAdvancePaymentInlineProps> = ({
  row,
  isUpdating,
  onSave,
  onCancel: onCancelProp,
}) => {
  const [paidAmount, setPaidAmount] = useState<string>(row.paid_amount != null ? String(row.paid_amount) : "");
  const [expectedAmount, setExpectedAmount] = useState<string>(
    row.expected_amount != null ? String(row.expected_amount) : "",
  );
  const [status, setStatus] = useState<AdvancePaymentStatus>(row.status);

  const handleSave = () => {
    onSave(
      paidAmount === "" ? null : paidAmount,
      status,
      expectedAmount === "" ? null : expectedAmount,
    );
  };

  const handleCancel = () => {
    onCancelProp?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      <Input
        type="number"
        min={0}
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
        placeholder="שולם"
        className="w-20 py-1 text-xs text-left"
        autoFocus
      />
      <Input
        type="number"
        min={0}
        value={expectedAmount}
        onChange={(e) => setExpectedAmount(e.target.value)}
        placeholder="צפוי"
        className="w-20 py-1 text-xs text-left"
      />
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value as AdvancePaymentStatus)}
        options={ADVANCE_PAYMENT_STATUS_OPTIONS}
      />
      {isUpdating ? (
        <Loader2 size={14} className="animate-spin text-primary-500" />
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="px-1 py-1 text-positive-700 hover:bg-positive-50"
            title="שמור"
            aria-label="שמור"
          >
            <Check size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="px-1 py-1 text-gray-400 hover:bg-gray-100"
            title="ביטול"
            aria-label="ביטול"
          >
            <X size={14} />
          </Button>
        </>
      )}
    </div>
  );
};
