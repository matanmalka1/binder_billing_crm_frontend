import { AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
import { mapActions } from "@/lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "@/lib/actions/types";
import { cn } from "@/utils/utils";
import { QUICK_ACTION_COPY } from "../quickActionsConstants";
import { getQuickActionCountLabel, groupQuickActions } from "../quickActionsUtils";
import { QuickActionButton } from "./QuickActionButton";

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
  const groups = groupQuickActions(actions);
  const totalCount = actions.length;
  const overdueCount = actions.filter((a) => a.urgency === "overdue").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-l from-info-50/60 to-transparent px-6 py-4">
        <div
          className={cn(
            "rounded-xl p-2",
            overdueCount > 0 ? "bg-red-100 text-red-600" : "bg-info-100 text-info-600",
          )}
        >
          {overdueCount > 0 ? <AlertTriangle className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-gray-900">{QUICK_ACTION_COPY.title}</h2>
          <p className="text-xs text-gray-400">{getQuickActionCountLabel(totalCount)}</p>
        </div>
        {overdueCount > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
            {overdueCount} באיחור
          </span>
        )}
      </div>

      {/* Body */}
      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <CheckCircle className="h-10 w-10 text-positive-400" />
          <p className="text-sm font-semibold text-gray-700">{QUICK_ACTION_COPY.emptyTitle}</p>
          <p className="text-xs text-gray-400">{QUICK_ACTION_COPY.emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-50 p-5">
          {groups.map((group) => {
            const groupOverdue = group.actions.filter((i) => i.action.urgency === "overdue").length;
            return (
              <div key={group.category} className="pt-4 first:pt-0">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {group.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      groupOverdue > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-info-100 text-info-600",
                    )}
                  >
                    {group.actions.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.actions.map(({ action, index }) => {
                    const isLoading = activeActionKey === action.uiKey;
                    return (
                      <QuickActionButton
                        key={action.uiKey}
                        action={action}
                        isLoading={isLoading}
                        isDisabled={activeActionKey !== null && !isLoading}
                        index={index}
                        onQuickAction={onQuickAction}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {totalCount > 0 && (
        <div className="flex items-start gap-2 border-t border-gray-100 bg-primary-50/40 px-5 py-3 text-xs text-primary-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{QUICK_ACTION_COPY.footerHint}</span>
        </div>
      )}
    </div>
  );
};

OperationalPanel.displayName = "OperationalPanel";
