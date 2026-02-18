import {
  Users,
  FolderOpen,
  AlertTriangle,
  Calendar,
  CalendarClock,
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
              },
              {
                key: "active_binders",
                title: "קלסרים פעילים",
                value: dashboard.data.active_binders,
                description: "טרם הוחזרו ללקוח",
                icon: FolderOpen,
                variant: "green",
              },
              {
                key: "overdue_binders",
                title: "קלסרים באיחור",
                value: dashboard.data.overdue_binders,
                description: "חרגו מ-90 יום",
                icon: AlertTriangle,
                variant: "red",
                urgent: dashboard.data.overdue_binders > 0,
              },
              {
                key: "due_today",
                title: "החזרה היום",
                value: dashboard.data.binders_due_today,
                description: "מועד החזרה הוא היום",
                icon: Calendar,
                variant: "amber",
              },
              {
                key: "due_week",
                title: "החזרה השבוע",
                value: dashboard.data.binders_due_this_week,
                description: "מועד החזרה תוך 7 ימים",
                icon: CalendarClock,
                variant: "purple",
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
              },
              {
                key: "ready",
                title: "מוכן לאיסוף",
                value: dashboard.data.binders_ready_for_pickup,
                description: "ממתינים לאיסוף לקוח",
                icon: Users,
                variant: "green",
              },
              {
                key: "overdue",
                title: "באיחור",
                value: dashboard.data.binders_overdue,
                description: "חריגה ממועד החזרה",
                icon: AlertTriangle,
                variant: "red",
                urgent: dashboard.data.binders_overdue > 0,
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