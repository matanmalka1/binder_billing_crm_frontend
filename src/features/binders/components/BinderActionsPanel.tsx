import { BinderActionButtons } from "./BinderActionButtons";

interface BinderActionsPanelProps {
  status: string;
  disabled?: boolean;
  onMarkReady: React.MouseEventHandler<HTMLButtonElement>;
  onRevertReady?: React.MouseEventHandler<HTMLButtonElement>;
  onReturn?: React.MouseEventHandler<HTMLButtonElement>;
  onBulkReady?: React.MouseEventHandler<HTMLButtonElement>;
  onOpenHandover?: React.MouseEventHandler<HTMLButtonElement>;
}

export const BinderActionsPanel: React.FC<BinderActionsPanelProps> = ({
  status,
  disabled = false,
  onMarkReady,
  onRevertReady,
  onReturn,
  onBulkReady,
  onOpenHandover,
}) => {
  if (status !== "in_office" && status !== "closed_in_office" && status !== "ready_for_pickup") {
    return null;
  }

  return (
    <div className="pt-2 flex items-center gap-2">
      <BinderActionButtons
        status={status}
        disabled={disabled}
        onMarkReady={onMarkReady}
        onRevertReady={onRevertReady}
        onReturn={onReturn}
        size="sm"
      />
      {(status === "in_office" || status === "closed_in_office") && onBulkReady && (
        <button
          type="button"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onBulkReady}
          disabled={disabled}
        >
          מוכן עד תקופה
        </button>
      )}
      {status === "ready_for_pickup" && onOpenHandover && (
        <button
          type="button"
          className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-800 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onOpenHandover}
          disabled={disabled}
        >
          מסירת כמה קלסרים
        </button>
      )}
    </div>
  );
};

BinderActionsPanel.displayName = "BinderActionsPanel";
