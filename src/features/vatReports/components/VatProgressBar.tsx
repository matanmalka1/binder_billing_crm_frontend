import { cn } from "../../../utils/utils";
import { VAT_WORKFLOW_STEPS } from "../constants";
import type { VatProgressBarProps } from "../types";

export const VatProgressBar: React.FC<VatProgressBarProps> = ({ currentStatus }) => {
  const currentIdx = VAT_WORKFLOW_STEPS.indexOf(currentStatus as typeof VAT_WORKFLOW_STEPS[number]);
  const step = currentIdx >= 0 ? currentIdx + 1 : 1;
  const total = VAT_WORKFLOW_STEPS.length;
  const percent = Math.round((step / total) * 100);
  const isFiled = currentStatus === "filed";

  return (
    <div className="flex items-center gap-3" dir="rtl">
      <div className="relative flex-1 overflow-hidden rounded-full bg-gray-100 h-2">
        <div
          className={cn(
            "absolute inset-y-0 right-0 rounded-full transition-all duration-500",
            isFiled ? "bg-positive-500" : "bg-primary-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-gray-500 tabular-nums">
        שלב {step}/{total}
      </span>
    </div>
  );
};

VatProgressBar.displayName = "VatProgressBar";
