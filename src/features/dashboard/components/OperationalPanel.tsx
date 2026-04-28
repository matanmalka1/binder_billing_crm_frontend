import { AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
import { mapActions } from "@/lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "@/lib/actions/types";
import { QUICK_ACTION_COPY } from "../quickActionsConstants";
import { getQuickActionCountLabel, groupQuickActions } from "../quickActionsUtils";
import {
  DashboardBadge,
  DashboardEmptyState,
  DashboardPanel,
  DashboardSectionHeader,
} from "./DashboardPrimitives";
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
    <DashboardPanel>
      <div className="border-b border-gray-100 bg-white px-5 py-4">
        <DashboardSectionHeader
          title={QUICK_ACTION_COPY.title}
          subtitle={getQuickActionCountLabel(totalCount)}
          icon={overdueCount > 0 ? AlertTriangle : Zap}
          tone={overdueCount > 0 ? "red" : "blue"}
          count={totalCount}
          action={
            overdueCount > 0 ? (
              <DashboardBadge tone="red" strong>
                {overdueCount} באיחור
              </DashboardBadge>
            ) : null
          }
        />
      </div>

      {totalCount > 0 && (
        <details className="border-b border-gray-100 bg-slate-50/70 px-5 py-2 text-[11px] text-gray-500">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-slate-700">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>איך פעולות עובדות</span>
          </summary>
          <p className="mt-1.5 leading-5 text-gray-400">{QUICK_ACTION_COPY.footerHint}</p>
        </details>
      )}

      {totalCount === 0 ? (
        <DashboardEmptyState
          icon={CheckCircle}
          title={QUICK_ACTION_COPY.emptyTitle}
          description={QUICK_ACTION_COPY.emptyDescription}
          className="py-14"
        />
      ) : (
        <div className="space-y-5 bg-gray-50/50 p-4">
          {groups.map((group) => {
            const groupOverdue = group.actions.filter((i) => i.action.urgency === "overdue").length;
            return (
              <section key={group.category} className="rounded-2xl border border-gray-200 bg-white p-3">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">{group.label}</span>
                    <DashboardBadge tone={groupOverdue > 0 ? "red" : "blue"}>
                      {group.actions.length}
                    </DashboardBadge>
                  </div>
                  {groupOverdue > 0 && (
                    <span className="text-[11px] font-semibold text-red-600">
                      {groupOverdue} באיחור
                    </span>
                  )}
                </div>
                <div className="space-y-2">
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
              </section>
            );
          })}
        </div>
      )}
    </DashboardPanel>
  );
};

OperationalPanel.displayName = "OperationalPanel";
