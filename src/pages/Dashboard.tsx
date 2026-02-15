import { Card } from "../components/ui/Card";
import { AccessDenied } from "../components/auth/AccessDenied";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { DashboardContent } from "../features/dashboard/components/DashboardContent";
import { SecretaryDashboardContent } from "../features/dashboard/components/SecretaryDashboardContent";
import { useDashboardPage } from "../features/dashboard/hooks/useDashboardPage";

export const Dashboard: React.FC = () => {
  const {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    pendingQuickAction,
    runQuickAction,
    setPendingQuickAction,
  } = useDashboardPage();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">לוח בקרה</h2>
        <p className="text-gray-600">ברוך הבא למערכת בינדר וחיובים</p>
      </header>

      {denied && <AccessDenied message="אין הרשאה לצפות בנתוני לוח בקרה זה" />}

      {dashboard.status === "loading" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-blue-700">{dashboard.message}</p>
        </Card>
      )}

      {dashboard.status === "error" && !denied && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              שגיאה בטעינת לוח הבקרה
            </p>
            <p className="mt-4 text-sm text-orange-700">{dashboard.message}</p>
          </div>
        </Card>
      )}

      {dashboard.status === "ok" && dashboard.data?.role_view === "advisor" && (
        <DashboardContent
          data={dashboard.data}
          attentionItems={attentionItems}
          quickActions={dashboard.data.quick_actions ?? []}
          activeQuickAction={activeQuickAction}
          onQuickAction={handleQuickAction}
        />
      )}

      {dashboard.status === "ok" &&
        dashboard.data?.role_view === "secretary" && (
          <SecretaryDashboardContent
            data={dashboard.data}
            attentionItems={attentionItems}
          />
        )}

      {dashboard.status === "idle" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <p className="text-gray-500">מאתחל...</p>
        </Card>
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
        onConfirm={async () => {
          if (!pendingQuickAction) return;
          await runQuickAction(pendingQuickAction);
          setPendingQuickAction(null);
        }}
        onCancel={() => setPendingQuickAction(null)}
      />
    </div>
  );
};
