import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { BulkChargeActionPayload } from "../../../api/charges.api";

interface ChargeBulkToolbarProps {
  selectedCount: number;
  loading: boolean;
  onAction: (action: BulkChargeActionPayload["action"], cancellationReason?: string) => Promise<void>;
  onClear: () => void;
}

export const ChargeBulkToolbar: React.FC<ChargeBulkToolbarProps> = ({
  selectedCount,
  loading,
  onAction,
  onClear,
}) => {
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancel = async () => {
    await onAction("cancel", cancelReason || undefined);
    setShowCancelInput(false);
    setCancelReason("");
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-primary-700">
          {selectedCount} נבחרו
        </span>
        <div className="h-4 w-px bg-primary-200" />
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            label="הנפק"
            disabled={loading}
            loading={loading}
            onClick={() => void onAction("issue")}
          />
          <ActionButton
            label="סמן כשולם"
            disabled={loading}
            loading={loading}
            onClick={() => void onAction("mark-paid")}
          />
          <ActionButton
            label="בטל"
            disabled={loading}
            loading={loading}
            variant="danger"
            onClick={() => setShowCancelInput((v) => !v)}
          />
        </div>
        <div className="h-4 w-px bg-primary-200" />
        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          נקה בחירה
        </button>
      </div>
      {showCancelInput && (
        <div className="flex items-center gap-2">
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="סיבת ביטול (אופציונלי)"
            rows={1}
            className="flex-1 resize-none rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
          <ActionButton
            label="אשר ביטול"
            disabled={loading}
            loading={loading}
            variant="danger"
            onClick={() => void handleCancel()}
          />
          <button
            type="button"
            onClick={() => { setShowCancelInput(false); setCancelReason(""); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            חזור
          </button>
        </div>
      )}
    </div>
  );
};

interface ActionButtonProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  variant?: "default" | "danger";
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, disabled, loading, onClick, variant = "default" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
      variant === "danger"
        ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
        : "border border-primary-300 bg-white text-primary-700 hover:bg-primary-100"
    }`}
  >
    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    {label}
  </button>
);
