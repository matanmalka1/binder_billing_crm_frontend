import { ArrowLeft, Bell, ExternalLink, ShieldAlert } from "lucide-react";
import type { ActionCommand } from "@/lib/actions/types";
import { cn } from "@/utils/utils";
import { staggerAnimationDelayVars } from "@/utils/animation";
import {
  QUICK_ACTION_COPY,
  QUICK_ACTION_ENTER_DELAY_MS,
  QUICK_ACTION_URGENCY_LABELS,
} from "../quickActionsConstants";
import { getQuickActionPresentation } from "../quickActionsUtils";
import { DashboardBadge } from "./DashboardPrimitives";

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
  const tone = isOverdue ? "red" : isUpcoming ? "amber" : presentation.isReadOnly ? "blue" : "neutral";
  const IconComponent = presentation.isReadOnly ? ExternalLink : Bell;

  const baseClass = cn(
    "group relative flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-right",
    "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "animate-fade-in",
    isLoading
      ? "border-blue-300 bg-blue-50 focus-visible:ring-blue-500"
      : isDisabled
        ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-45 focus-visible:ring-gray-300"
        : isOverdue
          ? "border-red-200 hover:border-red-300 hover:bg-red-50/50 focus-visible:ring-red-400"
          : isUpcoming
            ? "border-amber-200 hover:border-amber-300 hover:bg-amber-50/50 focus-visible:ring-amber-400"
            : presentation.isReadOnly
              ? "border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 focus-visible:ring-blue-500"
              : "border-gray-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-500",
  );

  const iconClass = cn(
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
    isLoading
      ? "border-blue-200 bg-blue-100 text-blue-700"
      : isOverdue
        ? "border-red-100 bg-red-50 text-red-600"
        : isUpcoming
          ? "border-amber-100 bg-amber-50 text-amber-600"
          : presentation.isReadOnly
            ? "border-blue-100 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-slate-50 text-slate-600",
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
      <span className={iconClass}>
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        ) : (
          <IconComponent className="h-4 w-4" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {action.urgency && (
            <DashboardBadge tone={isOverdue ? "red" : "amber"} strong>
              {QUICK_ACTION_URGENCY_LABELS[action.urgency]}
            </DashboardBadge>
          )}
          <DashboardBadge tone={presentation.isReadOnly ? "blue" : "neutral"}>
            {presentation.effectLabel}
          </DashboardBadge>
          {presentation.requiresConfirmation && (
            <DashboardBadge tone="amber" strong className="gap-1">
              <ShieldAlert className="h-3 w-3" />
              {QUICK_ACTION_COPY.requiresConfirmation}
            </DashboardBadge>
          )}
        </span>

        <span
          className={cn(
            "block truncate text-sm font-bold",
            isLoading ? "text-blue-800" : isOverdue ? "text-red-900" : "text-gray-900",
          )}
        >
          {action.label || "-"}
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {action.clientName && <span className="truncate">{action.clientName}</span>}
          {action.binderNumber && <span className="truncate">{action.binderNumber}</span>}
          {action.dueLabel && (
            <span className={cn("font-semibold", isOverdue ? "text-red-600" : "text-amber-600")}>
              {action.dueLabel}
            </span>
          )}
          {isLoading && <span className="font-semibold text-blue-700">{QUICK_ACTION_COPY.loading}</span>}
        </span>
      </span>

      <ArrowLeft
        className={cn(
          "h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5",
          tone === "red"
            ? "text-red-500"
            : tone === "amber"
              ? "text-amber-500"
              : tone === "blue"
                ? "text-blue-500"
                : "text-slate-400",
        )}
      />
    </button>
  );
};

QuickActionButton.displayName = "QuickActionButton";
