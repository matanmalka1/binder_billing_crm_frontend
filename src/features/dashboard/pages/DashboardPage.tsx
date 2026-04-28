import { Alert } from "@/components/ui/overlays/Alert";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import {
  AdvisorTodayCard,
  AttentionPanel,
  DashboardStatsGrid,
  OperationalPanel,
  SeasonSummaryWidget,
  useDashboardPage,
} from "@/features/dashboard";
import { DashboardSurface } from "../components/DashboardPrimitives";

export const Dashboard: React.FC = () => {
  const {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    isAdvisorView,
    confirmPendingAction,
    cancelPendingAction,
    pendingQuickAction,
    quickActions,
    stats,
  } = useDashboardPage();
  return (
    <DashboardSurface>
      <div className="px-1">
        <h1 className="text-2xl font-bold text-gray-950">לוח בקרה</h1>
        <p className="mt-1 text-sm text-gray-500">תמונת מצב תפעולית להיום</p>
      </div>

      {denied && (
        <Alert variant="warning" message="אין הרשאה לצפות בנתוני לוח בקרה זה" />
      )}
      {dashboard.status === "error" && !denied && (
        <Alert variant="error" message={dashboard.message} />
      )}

      {dashboard.status === "loading" ? (
        <div className="grid animate-pulse grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : dashboard.status === "ok" ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}

      {dashboard.status === "loading" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
          <div className="space-y-5">
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>
      ) : isAdvisorView ? (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {quickActions && (
              <OperationalPanel
                quickActions={quickActions}
                activeActionKey={activeQuickAction}
                onQuickAction={handleQuickAction}
              />
            )}
          </div>
          <aside className="space-y-5">
            <SeasonSummaryWidget />
            <AdvisorTodayCard />
          </aside>
        </div>
      ) : null}

      {dashboard.status === "loading" ? (
        <div className="h-56 animate-pulse rounded-2xl bg-gray-100" />
      ) : (
        <AttentionPanel items={attentionItems} />
      )}
      <ConfirmDialog
        open={Boolean(pendingQuickAction)}
        title={pendingQuickAction?.confirm?.title || "אישור פעולה"}
        message={pendingQuickAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingQuickAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingQuickAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeQuickAction === pendingQuickAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </DashboardSurface>
  );
};
