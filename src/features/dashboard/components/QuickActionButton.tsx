import { ArrowLeft, CheckSquare } from "lucide-react";
import type { ActionCommand } from "@/lib/actions/types";
import { cn } from "@/utils/utils";
import { staggerAnimationDelayVars } from "@/utils/animation";
import { QUICK_ACTION_COPY, QUICK_ACTION_ENTER_DELAY_MS } from "../quickActionsConstants";
import { getQuickActionPresentation } from "../quickActionsUtils";

interface QuickActionButtonProps {
  action: ActionCommand;
  isLoading: boolean;
  isDisabled: boolean;
  index: number;
  onQuickAction: (action: ActionCommand) => void;
}

export const QuickActionButton = ({
  action,
  isLoading,
  isDisabled,
  index,
  onQuickAction,
}: QuickActionButtonProps) => {
  const presentation = getQuickActionPresentation(action);
  const baseClass = cn(
    "group relative flex items-center justify-between gap-2 rounded-xl border-2 p-2.5 text-right",
    "transition-all duration-200 focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-info-500 focus-visible:ring-offset-2",
    "animate-fade-in",
    isLoading
      ? "border-info-400 bg-info-50 shadow-inner"
      : isDisabled
        ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40"
        : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-info-300 hover:shadow-lg hover:shadow-info-50",
  );

  return (
    <button
      type="button"
      onClick={() => onQuickAction(action)}
      disabled={isDisabled}
      className={`${baseClass} [animation-delay:var(--enter-delay)]`}
      style={staggerAnimationDelayVars(index, QUICK_ACTION_ENTER_DELAY_MS)}
      title={presentation.title}
      aria-label={presentation.ariaLabel}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {presentation.categoryLabel}
          </span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              presentation.isReadOnly
                ? "bg-info-50 text-info-700"
                : "bg-warning-50 text-warning-700",
            )}
          >
            {presentation.effectLabel}
          </span>
        </div>
        <p
          className={cn(
            "truncate text-[13px] font-semibold transition-colors",
            isLoading ? "text-info-700" : "text-gray-800 group-hover:text-info-700",
          )}
        >
          {action.label || "-"}
        </p>
        {action.clientName && (
          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {action.clientName}
            {action.binderNumber && ` · ${action.binderNumber}`}
          </p>
        )}
        {action.dueLabel && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-warning-600">
            {action.dueLabel}
          </p>
        )}
        {!action.dueLabel && presentation.requiresConfirmation && (
          <p className="mt-0.5 text-[11px] font-medium text-warning-600">
            {QUICK_ACTION_COPY.requiresConfirmation}
          </p>
        )}
        <p className="mt-0.5 truncate text-[11px] leading-snug text-gray-400">
          {presentation.effectDescription}
        </p>
        {isLoading && (
          <p className="mt-0.5 text-[11px] font-semibold text-info-700">
            {QUICK_ACTION_COPY.loading}
          </p>
        )}
      </div>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
          isLoading ? "bg-info-200" : "bg-gray-100 group-hover:bg-info-100",
        )}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-info-600 border-t-transparent" />
        ) : presentation.isReadOnly ? (
          <ArrowLeft className="h-4 w-4 text-gray-400 transition-colors group-hover:text-info-600" />
        ) : (
          <CheckSquare className="h-4 w-4 text-gray-400 transition-colors group-hover:text-info-600" />
        )}
      </div>
      <div className="absolute bottom-0 right-0 h-0.5 w-0 rounded-full bg-gradient-to-l from-info-500 to-primary-500 transition-all duration-300 group-hover:w-full" />
    </button>
  );
};

QuickActionButton.displayName = "QuickActionButton";
