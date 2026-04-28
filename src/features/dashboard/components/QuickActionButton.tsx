import { Bell, ExternalLink } from "lucide-react";
import type { ActionCommand } from "@/lib/actions/types";
import { cn } from "@/utils/utils";
import { staggerAnimationDelayVars } from "@/utils/animation";
import { QUICK_ACTION_COPY, QUICK_ACTION_ENTER_DELAY_MS, QUICK_ACTION_URGENCY_LABELS } from "../quickActionsConstants";
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
  const isOverdue = action.urgency === "overdue";
  const isUpcoming = action.urgency === "upcoming";

  const baseClass = cn(
    "group relative flex items-start justify-between gap-2 rounded-xl border-2 p-3 text-right w-full",
    "transition-all duration-200 focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2",
    "animate-fade-in",
    isLoading
      ? "border-info-400 bg-info-50 shadow-inner focus-visible:ring-info-500"
      : isDisabled
        ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40 focus-visible:ring-gray-300"
        : isOverdue
          ? "border-red-200 bg-red-50/40 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg hover:shadow-red-50 focus-visible:ring-red-400"
          : isUpcoming
            ? "border-amber-200 bg-amber-50/30 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 focus-visible:ring-amber-400"
            : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-info-300 hover:shadow-lg hover:shadow-info-50 focus-visible:ring-info-500",
  );

  const IconComponent = presentation.isReadOnly ? ExternalLink : Bell;

  const iconWrapClass = cn(
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all mt-0.5",
    isLoading
      ? "bg-info-200"
      : isOverdue
        ? "bg-red-100 group-hover:bg-red-200"
        : isUpcoming
          ? "bg-amber-100 group-hover:bg-amber-200"
          : presentation.isReadOnly
            ? "bg-info-50 group-hover:bg-info-100"
            : "bg-amber-50 group-hover:bg-amber-100",
  );

  const iconColorClass = cn(
    "h-4 w-4 transition-colors",
    isLoading
      ? "text-info-600"
      : isOverdue
        ? "text-red-500 group-hover:text-red-600"
        : isUpcoming
          ? "text-amber-500 group-hover:text-amber-600"
          : presentation.isReadOnly
            ? "text-info-500 group-hover:text-info-600"
            : "text-amber-500 group-hover:text-amber-600",
  );

  // Action-type badge: blue for navigation (get), amber for mutations (post/patch/put/delete)
  const actionTypeBadgeClass = cn(
    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
    presentation.isReadOnly
      ? "bg-info-100 text-info-700"
      : "bg-amber-100 text-amber-700",
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
        {/* Badge row: urgency · action-type · confirmation */}
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          {action.urgency && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
              )}
            >
              {QUICK_ACTION_URGENCY_LABELS[action.urgency]}
            </span>
          )}
          <span className={actionTypeBadgeClass}>
            {presentation.effectLabel}
          </span>
          {presentation.requiresConfirmation && (
            <span className="rounded-full bg-warning-50 px-1.5 py-0.5 text-[10px] font-semibold text-warning-700">
              {QUICK_ACTION_COPY.requiresConfirmation}
            </span>
          )}
        </div>

        {/* Action label */}
        <p
          className={cn(
            "truncate text-[13px] font-semibold transition-colors",
            isLoading
              ? "text-info-700"
              : isOverdue
                ? "text-red-800 group-hover:text-red-900"
                : isUpcoming
                  ? "text-amber-800 group-hover:text-amber-900"
                  : "text-gray-800 group-hover:text-info-700",
          )}
        >
          {action.label || "-"}
        </p>

        {/* Client name */}
        {action.clientName && (
          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {action.clientName}
            {action.binderNumber && ` · ${action.binderNumber}`}
          </p>
        )}

        {/* Due label — always shown when present */}
        {action.dueLabel && (
          <p
            className={cn(
              "mt-0.5 truncate text-[11px] font-medium",
              isOverdue ? "text-red-600" : "text-amber-600",
            )}
          >
            {action.dueLabel}
          </p>
        )}

        {isLoading && (
          <p className="mt-0.5 text-[11px] font-semibold text-info-700">
            {QUICK_ACTION_COPY.loading}
          </p>
        )}
      </div>

      {/* Icon */}
      <div className={iconWrapClass}>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-info-600 border-t-transparent" />
        ) : (
          <IconComponent className={iconColorClass} />
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 right-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full",
          isOverdue
            ? "bg-gradient-to-l from-red-500 to-red-400"
            : isUpcoming
              ? "bg-gradient-to-l from-amber-500 to-amber-400"
              : presentation.isReadOnly
                ? "bg-gradient-to-l from-info-500 to-info-400"
                : "bg-gradient-to-l from-amber-500 to-amber-400",
        )}
      />
    </button>
  );
};

QuickActionButton.displayName = "QuickActionButton";
