import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../utils/utils";

interface BulkSelectionToolbarProps {
  children: ReactNode;
  clearLabel?: string;
  extra?: ReactNode;
  loading: boolean;
  onClear: () => void;
  selectedCount: number;
}

export const BulkSelectionToolbar: React.FC<BulkSelectionToolbarProps> = ({
  children,
  clearLabel = "נקה בחירה",
  extra,
  loading,
  onClear,
  selectedCount,
}) => (
  <div className="flex flex-col gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5">
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-primary-700">{selectedCount} נבחרו</span>
      <div className="h-4 w-px bg-primary-200" />
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <div className="h-4 w-px bg-primary-200" />
      <button
        type="button"
        onClick={onClear}
        disabled={loading}
        className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        {clearLabel}
      </button>
    </div>
    {extra}
  </div>
);

interface BulkSelectionActionButtonProps {
  disabled: boolean;
  label: string;
  loading: boolean;
  onClick: () => void;
  variant?: "default" | "danger";
}

export const BulkSelectionActionButton: React.FC<BulkSelectionActionButtonProps> = ({
  disabled,
  label,
  loading,
  onClick,
  variant = "default",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
      variant === "danger"
        ? "border border-negative-200 bg-white text-negative-600 hover:bg-negative-50"
        : "border border-primary-300 bg-white text-primary-700 hover:bg-primary-100",
    )}
  >
    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    {label}
  </button>
);
