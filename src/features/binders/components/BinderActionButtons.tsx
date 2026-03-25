import { cn } from "../../../utils/utils";
import { canMarkReady, canRevertReady } from "../utils";

interface BinderActionButtonsProps {
  status: string;
  disabled?: boolean;
  onMarkReady: React.MouseEventHandler<HTMLButtonElement>;
  onRevertReady?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "inline";
}

const btn =
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const BinderActionButtons: React.FC<BinderActionButtonsProps> = ({
  status,
  disabled = false,
  onMarkReady,
  onRevertReady,
  size = "inline",
}) => {
  const gap = size === "sm" ? "flex flex-wrap gap-2 py-2" : "flex flex-wrap items-center gap-1.5";

  return (
    <div className={gap}>
      {canMarkReady(status) && (
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkReady}
          className={cn(btn, "border-green-200 bg-green-50 text-green-700 hover:bg-green-100")}
        >
          מוכן לאיסוף
        </button>
      )}
      {canRevertReady(status) && (
        <button
          type="button"
          disabled={disabled}
          onClick={onRevertReady}
          className={cn(btn, "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100")}
        >
          בטל מוכן לאיסוף
        </button>
      )}
    </div>
  );
};

BinderActionButtons.displayName = "BinderActionButtons";
