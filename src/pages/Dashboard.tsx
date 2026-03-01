import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { ErrorCard } from "../components/ui/ErrorCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { DashboardStatsGrid } from "../features/dashboard/components/DashboardStatsGrid";
import { AdvisorTodayCard } from "../features/dashboard/components/AdvisorTodayCard";
import { AttentionPanel } from "../features/dashboard/components/AttentionPanel";
import { OperationalPanel } from "../features/dashboard/components/OperationalPanel";
import { UrgencyBar } from "../features/dashboard/components/UrgencyBar";
import { useDashboardPage } from "../features/dashboard/hooks/useDashboardPage";

export const Dashboard: React.FC = () => {
  const {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    confirmPendingAction,
    cancelPendingAction,
    pendingQuickAction,
    stats,
  } = useDashboardPage();

  const isAdvisor = dashboard.status === "ok" && dashboard.data?.role_view === "advisor";
  const quickActions = isAdvisor && dashboard.data?.role_view === "advisor"
    ? dashboard.data.quick_actions
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="לוח בקרה" variant="gradient" />

      {denied && (
        <AccessBanner variant="warning" message="אין הרשאה לצפות בנתוני לוח בקרה זה" />
      )}

      {dashboard.status === "error" && !denied && (
        <ErrorCard message={dashboard.message} />
      )}

      {/* Urgency bar — pinned at top when attention items exist */}
      {dashboard.status === "ok" && attentionItems.length > 0 && (
        <UrgencyBar items={attentionItems} />
      )}

      {/* Stats — skeleton while loading */}
      {dashboard.status === "loading" ? (
        <div className="grid grid-cols-2 gap-4 animate-pulse sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : dashboard.status === "ok" ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}

      {/* Advisor: today card + quick actions */}
      {dashboard.status === "loading" ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : isAdvisor ? (
        <>
          <AdvisorTodayCard />
          {quickActions && (
            <OperationalPanel
              quickActions={quickActions}
              activeActionKey={activeQuickAction}
              onQuickAction={handleQuickAction}
            />
          )}
        </>
      ) : null}

      {/* Attention panel — shared by both roles */}
      {dashboard.status === "loading" ? (
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
      ) : dashboard.status === "ok" ? (
        <AttentionPanel items={attentionItems} />
      ) : null}

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
