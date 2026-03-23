import { getStatusLabel } from "../../api";
import { cn } from "../../../../utils/utils";
import type { TransitionTargetSelectorProps } from "../../types";

export const TransitionTargetSelector = ({
  allowed,
  selected,
  onSelect,
}: TransitionTargetSelectorProps) => {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-gray-500">העברה לסטטוס:</p>
      <div className="flex flex-wrap gap-2">
        {allowed.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onSelect(status)}
            className={cn(
              "rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
              selected === status
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/40 hover:text-primary-700",
            )}
          >
            {getStatusLabel(status)}
          </button>
        ))}
      </div>
    </div>
  );
};
