import { Users, FolderOpen, AlertTriangle, Calendar, CalendarClock } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { StatsCard } from "../components/ui/StatsCard";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { AttentionPanel } from "../features/dashboard/components/AttentionPanel";
import { OperationalPanel } from "../features/dashboard/components/OperationalPanel";
import { useDashboardPage } from "../features/dashboard/hooks/useDashboardPage";

export const DashboardRefactored: React.FC = () => {
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
      {/* Standardized Header */}
      <PageHeader
        title="לוח בקרה"
        description="ברוך הבא למערכת בינדר וחיובים"
      />

      {/* Access Denied Banner (non-blocking) */}
      {denied && (
        <AccessBanner
          variant="warning"
          message="אין הרשאה לצפות בנתוני לוח בקרה זה"
        />
      )}

      {/* Loading State */}
      {dashboard.status === "loading" && <PageLoading />}

      {/* Error State */}
      {dashboard.status === "error" && !denied && (
        <ErrorCard message={dashboard.message} />
      )}

      {/* Success - Advisor View */}
      {dashboard.status === "ok" && dashboard.data?.role_view === "advisor" && (
        <>
          {/* Stats Grid with Standardized Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="לקוחות"
              value={dashboard.data.total_clients}
              description="סך הכל לקוחות במערכת"
              icon={Users}
              variant="blue"
            />
            <StatsCard
              title="תיקים פעילים"
              value={dashboard.data.active_binders}
              description="תיקים שטרם הוחזרו"
              icon={FolderOpen}
              variant="green"
            />
            <StatsCard
              title="תיקים באיחור"
              value={dashboard.data.overdue_binders}
              description="חרגו מ-90 יום"
              icon={AlertTriangle}
              variant="red"
            />
            <StatsCard
              title="תיקים ליום זה"
              value={dashboard.data.binders_due_today}
              description="מועד החזרה היום"
              icon={Calendar}
              variant="orange"
            />
            <StatsCard
              title="תיקים לשבוע זה"
              value={dashboard.data.binders_due_this_week}
              description="מועד החזרה תוך 7 ימים"
              icon={CalendarClock}
              variant="purple"
            />
          </div>

          {/* Attention Panel */}
          <AttentionPanel items={attentionItems} />

          {/* Operational Panel */}
          <OperationalPanel
            quickActions={dashboard.data.quick_actions ?? []}
            activeActionKey={activeQuickAction}
            onQuickAction={handleQuickAction}
          />
        </>
      )}

      {/* Success - Secretary View */}
      {dashboard.status === "ok" && dashboard.data?.role_view === "secretary" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="תיקים במשרד"
              value={dashboard.data.binders_in_office}
              description="כלל התיקים הפעילים במשרד"
              icon={FolderOpen}
              variant="blue"
            />
            <StatsCard
              title="מוכן לאיסוף"
              value={dashboard.data.binders_ready_for_pickup}
              description="תיקים הממתינים לאיסוף לקוח"
              icon={Users}
              variant="green"
            />
            <StatsCard
              title="תיקים באיחור"
              value={dashboard.data.binders_overdue}
              description="תיקים בחריגה ממועד החזרה"
              icon={AlertTriangle}
              variant="red"
            />
          </div>

          {/* Attention Panel */}
          <AttentionPanel items={attentionItems} />
        </>
      )}

      {/* Confirm Dialog */}
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
        onCancel={() => setPendingQuickAction(null)}
      />
    </div>
  );
};
