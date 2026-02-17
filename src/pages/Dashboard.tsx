import { Users, FolderOpen, AlertTriangle, Calendar, CalendarClock } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { StatsCard } from "../components/ui/StatsCard";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { AttentionPanel } from "../features/dashboard/components/AttentionPanel";
import { OperationalPanel } from "../features/dashboard/components/OperationalPanel";
import { AdvisorTodayCard } from "../features/dashboard/components/AdvisorTodayCard";
import { useDashboardPage } from "../features/dashboard/hooks/useDashboardPage";

export const Dashboard: React.FC = () => {
  const {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    confirmPendingAction,
    pendingQuickAction,
    setPendingQuickAction,
  } = useDashboardPage();

  return (
    <div className="space-y-6">
      <PageHeader title="לוח בקרה" description="ברוך הבא למערכת בינדר וחיובים" />

      {denied && <AccessBanner variant="warning" message="אין הרשאה לצפות בנתוני לוח בקרה זה" />}

      {dashboard.status === "loading" && <PageLoading />}
      {dashboard.status === "error" && !denied && <ErrorCard message={dashboard.message} />}

      {dashboard.status === "ok" && dashboard.data?.role_view === "advisor" && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard title="לקוחות" value={dashboard.data.total_clients} description="סך הכל לקוחות במערכת" icon={Users} variant="blue" />
            <StatsCard title="קלסרים פעילים" value={dashboard.data.active_binders} description="קלסרים שטרם הוחזרו" icon={FolderOpen} variant="green" />
            <StatsCard title="קלסרים באיחור" value={dashboard.data.overdue_binders} description="חרגו מ-90 יום" icon={AlertTriangle} variant="red" />
            <StatsCard title="קלסרים ליום זה" value={dashboard.data.binders_due_today} description="מועד החזרה היום" icon={Calendar} variant="orange" />
            <StatsCard title="קלסרים לשבוע זה" value={dashboard.data.binders_due_this_week} description="מועד החזרה תוך 7 ימים" icon={CalendarClock} variant="purple" />
          </div>

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard title="קלסרים במשרד" value={dashboard.data.binders_in_office} description="כלל הקלסרים הפעילים במשרד" icon={FolderOpen} variant="blue" />
            <StatsCard title="מוכן לאיסוף" value={dashboard.data.binders_ready_for_pickup} description="קלסרים הממתינים לאיסוף לקוח" icon={Users} variant="green" />
            <StatsCard title="קלסרים באיחור" value={dashboard.data.binders_overdue} description="קלסרים בחריגה ממועד החזרה" icon={AlertTriangle} variant="red" />
          </div>
          <AttentionPanel items={attentionItems} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingQuickAction)}
        title={pendingQuickAction?.confirm?.title || "אישור פעולה"}
        message={pendingQuickAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingQuickAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingQuickAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeQuickAction === pendingQuickAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingQuickAction(null)}
      />
    </div>
  );
};
