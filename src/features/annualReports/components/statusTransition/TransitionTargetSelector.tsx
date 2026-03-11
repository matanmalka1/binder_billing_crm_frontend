import { ArrowLeft } from "lucide-react";
import { getStatusLabel } from "../../../../api/annualReport.extended.utils";
import { cn } from "../../../../utils/utils";
import type { TransitionTargetSelectorProps } from "../../types";

export const TransitionTargetSelector = ({
  allowed,
  selected,
  onSelect,
}: TransitionTargetSelectorProps) => {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-gray-500">מעבר ל:</p>
      <div className="flex flex-wrap gap-2">
        {allowed.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onSelect(status)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
              selected === status
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50",
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {getStatusLabel(status)}
          </button>
        ))}
      </div>
    </div>
  );
};
