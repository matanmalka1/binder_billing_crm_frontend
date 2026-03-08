import { useState } from "react";
import { Check, X, Pencil, Loader2 } from "lucide-react";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../../../api/advancePayments.api";
import { STATUS_LABEL } from "../utils";

const STATUS_OPTIONS: { value: AdvancePaymentStatus; label: string }[] = [
  { value: "pending", label: STATUS_LABEL.pending },
  { value: "partial", label: STATUS_LABEL.partial },
  { value: "paid", label: STATUS_LABEL.paid },
  { value: "overdue", label: STATUS_LABEL.overdue },
];

interface EditAdvancePaymentInlineProps {
  row: AdvancePaymentRow;
  isUpdating: boolean;
  onSave: (paid_amount: number | null, status: AdvancePaymentStatus, expected_amount: number | null) => void;
}

export const EditAdvancePaymentInline: React.FC<EditAdvancePaymentInlineProps> = ({
  row,
  isUpdating,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [expectedAmount, setExpectedAmount] = useState<string>("");
  const [status, setStatus] = useState<AdvancePaymentStatus>(row.status);

  const handleOpen = () => {
    setPaidAmount(row.paid_amount != null ? String(row.paid_amount) : "");
    setExpectedAmount(row.expected_amount != null ? String(row.expected_amount) : "");
    setStatus(row.status);
    setEditing(true);
  };

  const handleSave = () => {
    onSave(
      paidAmount === "" ? null : Number(paidAmount),
      status,
      expectedAmount === "" ? null : Number(expectedAmount),
    );
    setEditing(false);
  };

  const handleCancel = () => setEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") handleCancel();
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
      >
        <Pencil size={12} />
        עריכה
      </button>
    );
  }

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
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as AdvancePaymentStatus)}
        className="rounded border border-gray-300 px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
