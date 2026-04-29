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
import { DASHBOARD_COPY, DASHBOARD_LOADING_CARD_COUNT } from "../dashboardConstants";
import { DashboardSurface } from "../components/DashboardPrimitives";

const StatsSkeleton = () => (
  <div className="grid animate-pulse grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
    {Array.from({ length: DASHBOARD_LOADING_CARD_COUNT }, (_, index) => (
      <div key={index} className="h-32 rounded-xl bg-gray-100" />
    ))}
  </div>
);

const AdvisorSkeleton = () => (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
    <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
    <div className="space-y-5">
      <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
      <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  </div>
);

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
        <h1 className="text-2xl font-bold text-gray-950">{DASHBOARD_COPY.pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{DASHBOARD_COPY.pageSubtitle}</p>
      </div>

      {denied && (
        <Alert variant="warning" message={DASHBOARD_COPY.permissionDenied} />
      )}
      {dashboard.status === "error" && !denied && (
        <Alert variant="error" message={dashboard.message} />
      )}

      {isAdvisorView && <SeasonSummaryWidget />}

      {dashboard.status === "loading" ? (
        <StatsSkeleton />
      ) : dashboard.status === "ok" ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}

      {dashboard.status === "loading" ? (
        <AdvisorSkeleton />
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
        title={pendingQuickAction?.confirm?.title || DASHBOARD_COPY.confirmTitle}
        message={pendingQuickAction?.confirm?.message || DASHBOARD_COPY.confirmMessage}
        confirmLabel={pendingQuickAction?.confirm?.confirmLabel || DASHBOARD_COPY.confirmLabel}
        cancelLabel={pendingQuickAction?.confirm?.cancelLabel || DASHBOARD_COPY.cancelLabel}
        isLoading={activeQuickAction === pendingQuickAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </DashboardSurface>
  );
};
