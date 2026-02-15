import { Card } from "../../../components/ui/Card";
import { Zap, ChevronLeft } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";

interface OperationalPanelProps {
  quickActions: BackendAction[];
  activeActionKey: string | null;
  onQuickAction: (action: ActionCommand) => void;
}

export const OperationalPanel: React.FC<OperationalPanelProps> = ({
  quickActions,
  activeActionKey,
  onQuickAction,
}) => {
  const actions = mapActions(quickActions);

  if (actions.length === 0) {
    return null;
  }

  return (
    <Card 
      variant="elevated"
      title="פאנל תפעולי"
      subtitle="פעולות מהירות לניהול יעיל"
    >
      <div className="space-y-4">
        {/* Quick Actions Header */}
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-50 to-primary-50 p-3">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Zap className="h-4 w-4 text-accent-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">פעולות מהירות</p>
            <p className="text-xs text-gray-600">{actions.length} פעולות זמינות</p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  "group relative flex items-center justify-between gap-3",
                  "rounded-xl border-2 p-4 text-right transition-all duration-200",
                  "hover:shadow-lg hover:-translate-y-1",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  "animate-scale-in",
                  isLoading
                    ? "border-primary-300 bg-primary-50"
                    : isDisabled
                    ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-primary-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Action Content */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-900 transition-colors">
                    {action.label || "—"}
                  </p>
                  {action.key && (
                    <p className="mt-1 text-xs text-gray-600 font-mono">
                      {action.key}
                    </p>
                  )}
                </div>

                {/* Action Icon/Indicator */}
                <div className={cn(
                  "shrink-0 rounded-lg p-2 transition-all",
                  isLoading
                    ? "bg-primary-100"
                    : "bg-gray-100 group-hover:bg-primary-100"
                )}>
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                  ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
                  )}
                </div>

                {/* Hover Accent Line */}
                <div className={cn(
                  "absolute bottom-0 left-0 h-1 w-0 rounded-t-lg transition-all duration-300",
                  "bg-gradient-to-r from-primary-500 to-accent-500",
                  "group-hover:w-full"
                )} />
              </button>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <p className="flex items-start gap-2">
            <span className="text-blue-600">💡</span>
            <span>לחץ על פעולה לביצוע מהיר. פעולות מסוימות ידרשו אישור נוסף.</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
