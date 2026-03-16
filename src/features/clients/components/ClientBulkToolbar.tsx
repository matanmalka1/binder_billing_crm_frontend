import { Loader2 } from "lucide-react";
import type { BulkClientActionPayload } from "../../../api/clients.api";

interface ClientBulkToolbarProps {
  selectedCount: number;
  loading: boolean;
  onAction: (action: BulkClientActionPayload["action"]) => Promise<void>;
  onClear: () => void;
}

export const ClientBulkToolbar: React.FC<ClientBulkToolbarProps> = ({
  selectedCount,
  loading,
  onAction,
  onClear,
}) => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5">
    <span className="text-sm font-medium text-primary-700">{selectedCount} נבחרו</span>
    <div className="h-4 w-px bg-primary-200" />
    <div className="flex flex-wrap items-center gap-2">
      <ActionButton label="הקפא" disabled={loading} loading={loading} onClick={() => void onAction("freeze")} />
      <ActionButton label="סגור" disabled={loading} loading={loading} variant="danger" onClick={() => void onAction("close")} />
      <ActionButton label="הפעל" disabled={loading} loading={loading} onClick={() => void onAction("activate")} />
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
);

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
