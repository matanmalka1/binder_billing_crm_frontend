import { cn } from "../../../utils/utils";
import { canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";

interface ChargeActionButtonsProps {
  status: string;
  disabled?: boolean;
  onIssue: React.MouseEventHandler<HTMLButtonElement>;
  onMarkPaid: React.MouseEventHandler<HTMLButtonElement>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "inline";
}

const btn =
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const ChargeActionButtons: React.FC<ChargeActionButtonsProps> = ({
  status,
  disabled = false,
  onIssue,
  onMarkPaid,
  onCancel,
  size = "inline",
}) => {
  const gap = size === "sm" ? "flex flex-wrap gap-2 py-2" : "flex flex-wrap items-center gap-1.5";

  return (
    <div className={gap}>
      {canIssue(status) && (
        <button
          type="button"
          disabled={disabled}
          onClick={onIssue}
          className={cn(btn, "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")}
        >
          הנפקה
        </button>
      )}
      {canMarkPaid(status) && (
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkPaid}
          className={cn(btn, "border-green-200 bg-green-50 text-green-700 hover:bg-green-100")}
        >
          סימון שולם
        </button>
      )}
      {canCancel(status) && (
        <button
          type="button"
          disabled={disabled}
          onClick={onCancel}
          className={cn(btn, "border-red-200 bg-red-50 text-red-700 hover:bg-red-100")}
        >
          ביטול
        </button>
      )}
    </div>
  );
};

ChargeActionButtons.displayName = "ChargeActionButtons";