import { PageHeader } from "@/components/layout/PageHeader";
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
    <div className="space-y-6">
      <PageHeader title="לוח בקרה" />
      {denied && (
        <Alert variant="warning" message="אין הרשאה לצפות בנתוני לוח בקרה זה" />
      )}
      {dashboard.status === "error" && !denied && (
        <Alert variant="error" message={dashboard.message} />
      )}
      {/* Stats — skeleton while loading */}
      {dashboard.status === "loading" ? (
        <div className="grid grid-cols-2 gap-3 animate-pulse md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : dashboard.status === "ok" ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}
      {/* Advisor: quick actions + today card + season widget */}
      {dashboard.status === "loading" ? (
        <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
      ) : isAdvisorView ? (
        <>
          {quickActions && (
            <OperationalPanel
              quickActions={quickActions}
              activeActionKey={activeQuickAction}
              onQuickAction={handleQuickAction}
            />
          )}
          <SeasonSummaryWidget />
          <AdvisorTodayCard />
        </>
      ) : null}
      {/* Attention panel — shared by both roles */}
      {dashboard.status === "loading" ? (
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
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
    </div>
  );
};
