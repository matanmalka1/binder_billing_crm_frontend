import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { AccessDenied } from "../components/auth/AccessDenied";
import { dashboardApi } from "../api/dashboard.api";
import { getRequestErrorMessage, handleCanonicalActionError } from "../utils/errorHandler";
import { useUIStore } from "../store/ui.store";
import { useAuthStore } from "../store/auth.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { DashboardContent } from "../features/dashboard/components/DashboardContent";
import { SecretaryDashboardContent } from "../features/dashboard/components/SecretaryDashboardContent";
import type { AttentionResponse, DashboardData } from "../features/dashboard/types";

type DashboardState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
  data: DashboardData | null;
};

export const Dashboard: React.FC = () => {
  const { showToast } = useUIStore();
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardState>({
    status: "idle",
    message: "",
    data: null,
  });
  const [attentionItems, setAttentionItems] = useState<AttentionResponse["items"]>([]);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [pendingQuickAction, setPendingQuickAction] = useState<ResolvedBackendAction | null>(null);
  const [denied, setDenied] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user?.role) {
      setDashboard({
        status: "error",
        message: "לא ניתן לזהות תפקיד משתמש",
        data: null,
      });
      return;
    }

    setDashboard({ status: "loading", message: "טוען נתוני לוח בקרה...", data: null });
    setDenied(false);

    try {
      const attentionPromise = dashboardApi.getAttention();

      if (user.role === "advisor") {
        const [overview, attention] = await Promise.all([
          dashboardApi.getOverview(),
          attentionPromise,
        ]);

        setDashboard({
          status: "ok",
          message: "נתונים נטענו בהצלחה",
          data: {
            role_view: "advisor",
            ...overview,
          },
        });
        setAttentionItems(attention.items ?? []);
        return;
      }

      const [summary, attention] = await Promise.all([
        dashboardApi.getSummary(),
        attentionPromise,
      ]);

      setDashboard({
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: {
          role_view: "secretary",
          ...summary,
        },
      });
      setAttentionItems(attention.items ?? []);
    } catch (requestError: unknown) {
      const message = getRequestErrorMessage(requestError, "שגיאה בטעינת לוח הבקרה");
      const status =
        typeof (requestError as { response?: { status?: number } })?.response?.status ===
        "number"
          ? (requestError as { response: { status: number } }).response.status
          : null;

      if (status === 403) {
        setDenied(true);
      }

      setDashboard({
        status: "error",
        message,
        data: null,
      });
      setAttentionItems([]);
    }
  }, [user?.role]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const runQuickAction = useCallback(
    async (action: ResolvedBackendAction) => {
      setActiveQuickAction(action.uiKey);
      try {
        await executeBackendAction(action);
        showToast("הפעולה המהירה בוצעה בהצלחה", "success");
        await loadDashboard();
      } catch (requestError: unknown) {
        const message = handleCanonicalActionError({
          error: requestError,
          fallbackMessage: "שגיאה בביצוע פעולה מהירה",
          showToast,
        });
        setDashboard((prevState) => ({ ...prevState, message }));
      } finally {
        setActiveQuickAction(null);
      }
    },
    [loadDashboard, showToast],
  );

  const handleQuickAction = (action: ResolvedBackendAction) => {
    if (action.confirm) {
      setPendingQuickAction(action);
      return;
    }
    void runQuickAction(action);
  };

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
            <p className="text-lg font-medium text-gray-700">שגיאה בטעינת לוח הבקרה</p>
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

      {dashboard.status === "ok" && dashboard.data?.role_view === "secretary" && (
        <SecretaryDashboardContent data={dashboard.data} attentionItems={attentionItems} />
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
