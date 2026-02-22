import {
  Users,
  FolderOpen,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { DashboardStatsGrid } from "../features/dashboard/components/DashboardStatsGrid";
import { AdvisorTodayCard } from "../features/dashboard/components/AdvisorTodayCard";
import { AttentionPanel } from "../features/dashboard/components/AttentionPanel";
import { OperationalPanel } from "../features/dashboard/components/OperationalPanel";
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
  } = useDashboardPage();

  return (
    <div className="space-y-8">
      <PageHeader
        title="לוח בקרה"
        description="סקירה כוללת של המערכת ופעולות מהירות"
        variant="gradient"
      />

      {denied && (
        <AccessBanner
          variant="warning"
          message="אין הרשאה לצפות בנתוני לוח בקרה זה"
        />
      )}

      {dashboard.status === "loading" && (
        <PageLoading message="טוען נתוני לוח בקרה..." rows={2} columns={5} />
      )}

      {dashboard.status === "error" && !denied && (
        <ErrorCard message={dashboard.message} />
      )}

      {dashboard.status === "ok" && dashboard.data?.role_view === "advisor" && (
        <>
          <DashboardStatsGrid
            stats={[
              {
                key: "total_clients",
                title: "לקוחות",
                value: dashboard.data.total_clients,
                description: "סך הכל לקוחות פעילים",
                icon: Users,
                variant: "blue",
                href: "/clients",
              },
              {
                key: "active_binders",
                title: "קלסרים פעילים",
                value: dashboard.data.active_binders,
                description: "טרם הוחזרו ללקוח",
                icon: FolderOpen,
                variant: "green",
                href: "/binders?status=in_office",
              },
            ]}
          />

          <AdvisorTodayCard />
          <AttentionPanel items={attentionItems} />
          <OperationalPanel
            quickActions={dashboard.data.quick_actions ?? []}
            activeActionKey={activeQuickAction}
            onQuickAction={handleQuickAction}
          />
        </>
      )}

      {dashboard.status === "ok" && dashboard.data?.role_view === "secretary" && (
        <>
          <DashboardStatsGrid
            stats={[
              {
                key: "in_office",
                title: "קלסרים במשרד",
                value: dashboard.data.binders_in_office,
                description: "כלל הקלסרים הפעילים",
                icon: FolderOpen,
                variant: "blue",
                href: "/binders?status=in_office",
              },
              {
                key: "ready",
                title: "מוכן לאיסוף",
                value: dashboard.data.binders_ready_for_pickup,
                description: "ממתינים לאיסוף לקוח",
                icon: Users,
                variant: "green",
                href: "/binders?status=ready_for_pickup",
              },
            ]}
          />
          <AttentionPanel items={attentionItems} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingQuickAction)}
        title={pendingQuickAction?.confirm?.title || "אישור פעולה"}
        message={
          pendingQuickAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"
        }
        confirmLabel={pendingQuickAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingQuickAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeQuickAction === pendingQuickAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};
