import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Select } from "../../../components/ui/inputs/Select";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { ADVANCE_PAYMENT_STATUS_OPTIONS } from "../constants";

interface EditAdvancePaymentInlineProps {
  row: AdvancePaymentRow;
  isUpdating: boolean;
  onSave: (
    paid_amount: string | null,
    status: AdvancePaymentStatus,
    expected_amount: string | null,
  ) => void;
  onCancel?: () => void;
}

export const EditAdvancePaymentInline: React.FC<
  EditAdvancePaymentInlineProps
> = ({ row, isUpdating, onSave, onCancel: onCancelProp }) => {
  const [paidAmount, setPaidAmount] = useState<string>(
    row.paid_amount != null ? String(row.paid_amount) : "",
  );
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
      <input
        type="number"
        min={0}
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
        placeholder="שולם"
        className="w-20 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-left"
        autoFocus
      />
      <input
        type="number"
        min={0}
        value={expectedAmount}
        onChange={(e) => setExpectedAmount(e.target.value)}
        placeholder="צפוי"
        className="w-20 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-left"
      />
      <div className="min-w-28">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as AdvancePaymentStatus)}
          options={ADVANCE_PAYMENT_STATUS_OPTIONS}
          className="px-2 py-1 text-xs"
        />
      </div>
      {isUpdating ? (
        <Loader2 size={14} className="animate-spin text-blue-500" />
      ) : (
        <>
          <button
            type="button"
            onClick={handleSave}
            className="rounded p-1 text-green-600 hover:bg-green-50 transition-colors"
            title="שמור"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 transition-colors"
            title="ביטול"
          >
            <X size={14} />
          </button>
        </>
      )}
    </div>
  );
};
