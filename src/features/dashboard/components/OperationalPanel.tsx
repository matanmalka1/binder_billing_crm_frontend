import { Zap, ArrowLeft, Info } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

interface OperationalPanelProps {
  quickActions: BackendAction[];
  activeActionKey: string | null;
  onQuickAction: (action: ActionCommand) => void;
}

export const OperationalPanel = ({
  quickActions,
  activeActionKey,
  onQuickAction,
}: OperationalPanelProps) => {
  const actions = mapActions(quickActions);

  if (actions.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-l from-violet-50/60 to-transparent px-6 py-4">
        <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">פעולות מהירות</h2>
          <p className="text-xs text-gray-400">{actions.length} פעולות זמינות לביצוע מיידי</p>
        </div>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => {
          const isLoading = activeActionKey === action.uiKey;
          const isDisabled = activeActionKey !== null && !isLoading;

          return (
            <button
              key={action.uiKey}
              type="button"
              onClick={() => onQuickAction(action)}
              disabled={isDisabled}
              className={cn(
                "group relative flex items-center justify-between gap-3 rounded-xl border-2 p-4 text-right",
                "transition-all duration-200 focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                "animate-fade-in",
                isLoading
                  ? "border-violet-400 bg-violet-50 shadow-inner"
                  : isDisabled
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40"
                  : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-50"
              )}
              style={{ animationDelay: staggerDelay(index, 50) }}
            >
              {/* Label */}
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "truncate text-sm font-semibold transition-colors",
                  isLoading ? "text-violet-700" : "text-gray-800 group-hover:text-violet-700"
                )}>
                  {action.label || "—"}
                </p>
                {action.confirm && (
                  <p className="mt-0.5 text-xs text-amber-600 font-medium">
                    דורש אישור
                  </p>
                )}
              </div>

              {/* Arrow / spinner */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                isLoading
                  ? "bg-violet-200"
                  : "bg-gray-100 group-hover:bg-violet-100"
              )}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                ) : (
                  <ArrowLeft className={cn(
                    "h-4 w-4 transition-colors",
                    "text-gray-400 group-hover:text-violet-600"
                  )} />
                )}
              </div>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 right-0 h-0.5 w-0 rounded-full bg-gradient-to-l from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="flex items-start gap-2 border-t border-gray-100 bg-blue-50/40 px-5 py-3 text-xs text-blue-700">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>פעולות המסומנות "דורש אישור" יציגו חלון אישור לפני הביצוע</span>
      </div>
    </div>
  );
};

OperationalPanel.displayName = "OperationalPanel";
