import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { api } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { useUIStore } from "../store/ui.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { DashboardContent } from "../features/dashboard/components/DashboardContent";
import type { AttentionResponse, DashboardData } from "../features/dashboard/types";

type DashboardState = { status: "idle" | "loading" | "ok" | "error"; message: string; data: DashboardData | null };

export const Dashboard: React.FC = () => {
  const { showToast } = useUIStore();
  const [dashboard, setDashboard] = useState<DashboardState>({ status: "idle", message: "", data: null });
  const [attentionItems, setAttentionItems] = useState<AttentionResponse["items"]>([]);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [pendingQuickAction, setPendingQuickAction] = useState<ResolvedBackendAction | null>(null);

  const loadDashboard = useCallback(async () => {
    setDashboard({ status: "loading", message: "טוען נתוני לוח בקרה...", data: null });
    try {
      const [overviewResponse, attentionResponse] = await Promise.all([
        api.get<DashboardData>("/dashboard/overview"),
        api.get<AttentionResponse>("/dashboard/attention"),
      ]);
      setDashboard({ status: "ok", message: "נתונים נטענו בהצלחה", data: overviewResponse.data });
      setAttentionItems(attentionResponse.data.items ?? []);
    } catch (requestError: unknown) {
      setDashboard({
        status: "error",
        message: getApiErrorMessage(requestError, "לא התקבלה תגובה מהשרת (מצב קריאה בלבד)"),
        data: null,
      });
      setAttentionItems([]);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const runQuickAction = useCallback(async (action: ResolvedBackendAction) => {
    setActiveQuickAction(action.uiKey);
    try {
      await executeBackendAction(action);
      showToast("הפעולה המהירה בוצעה בהצלחה", "success");
      await loadDashboard();
    } catch (requestError: unknown) {
      const message = getApiErrorMessage(requestError, "שגיאה בביצוע פעולה מהירה");
      setDashboard((prevState) => ({ ...prevState, message }));
      showToast(message, "error");
    } finally {
      setActiveQuickAction(null);
    }
  }, [loadDashboard, showToast]);

  const handleQuickAction = (action: ResolvedBackendAction) => {
    if (action.confirm) {
      setPendingQuickAction(action);
      return;
    }
    void runQuickAction(action);
  };

  return (
    <div className="space-y-6">
      <header><h2 className="text-2xl font-bold text-gray-900">לוח בקרה</h2><p className="text-gray-600">ברוך הבא למערכת בינדר וחיובים</p></header>
      {dashboard.status === "loading" && <Card className="min-h-[200px] flex items-center justify-center"><p className="text-sm text-blue-700">{dashboard.message}</p></Card>}
      {dashboard.status === "error" && <Card className="min-h-[200px] flex items-center justify-center"><div className="text-center"><p className="text-lg font-medium text-gray-500">לוח בקרה - יתווסף בהמשך</p><p className="mt-4 text-sm text-orange-700">{dashboard.message}</p></div></Card>}
      {dashboard.status === "ok" && dashboard.data && (
        <DashboardContent
          data={dashboard.data}
          attentionItems={attentionItems}
          quickActions={dashboard.data.quick_actions ?? []}
          activeQuickAction={activeQuickAction}
          onQuickAction={handleQuickAction}
        />
      )}
      {dashboard.status === "idle" && <Card className="min-h-[200px] flex items-center justify-center"><p className="text-gray-500">מאתחל...</p></Card>}
      <ConfirmDialog
        open={Boolean(pendingQuickAction)}
        title={pendingQuickAction?.confirm?.title || "אישור פעולה"}
        message={pendingQuickAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
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
