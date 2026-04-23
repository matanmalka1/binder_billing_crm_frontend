import { Button } from "@/components/ui/primitives/Button";
import { canMarkReady, canReturn, canRevertReady } from "../../utils";

interface BinderActionButtonsProps {
  status: string;
  disabled?: boolean;
  onMarkReady: React.MouseEventHandler<HTMLButtonElement>;
  onRevertReady?: React.MouseEventHandler<HTMLButtonElement>;
  onReturn?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "inline";
}

export const BinderActionButtons: React.FC<BinderActionButtonsProps> = ({
  status,
  disabled = false,
  onMarkReady,
  onRevertReady,
  onReturn,
  size = "inline",
}) => {
  const gap = size === "sm" ? "flex flex-wrap gap-2 py-2" : "flex flex-wrap items-center gap-1.5";

  return (
    <div className={gap}>
      {canMarkReady(status) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onMarkReady}
          className="border-positive-200 bg-positive-50 text-positive-700 hover:bg-positive-100 text-xs px-2.5 py-1"
        >
          מוכן לאיסוף
        </Button>
      )}
      {canRevertReady(status) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onRevertReady}
          className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs px-2.5 py-1"
        >
          בטל מוכן לאיסוף
        </Button>
      )}
      {canReturn(status) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onReturn}
          className="border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs px-2.5 py-1"
        >
          החזרה
        </Button>
      )}
    </div>
  );
};

BinderActionButtons.displayName = "BinderActionButtons";
