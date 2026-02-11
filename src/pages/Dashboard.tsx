import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { api, triggerDashboardQuickAction } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { DashboardContent } from "../features/dashboard/components/DashboardContent";
import type {
  DashboardData,
  DashboardQuickAction,
  DashboardQuickActionWithEndpoint,
} from "../features/dashboard/types";

type DashboardState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
  data: DashboardData | null;
};

const isValidQuickAction = (
  action: DashboardQuickAction,
): action is DashboardQuickActionWithEndpoint => {
  return typeof action.endpoint === "string" && action.endpoint.length > 0;
};

export const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardState>({
    status: "idle",
    message: "",
    data: null,
  });
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(
    null,
  );

  const loadDashboard = useCallback(async () => {
    setDashboard({
      status: "loading",
      message: "טוען נתוני לוח בקרה...",
      data: null,
    });
    try {
      const response = await api.get<DashboardData>("/dashboard/overview");
      setDashboard({
        status: "ok",
        message: "נתונים נטענו בהצלחה",
        data: response.data,
      });
    } catch (error: unknown) {
      setDashboard({
        status: "error",
        message: getApiErrorMessage(
          error,
          "לא התקבלה תגובה מהשרת (מצב קריאה בלבד)",
        ),
        data: null,
      });
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleQuickAction = async (action: DashboardQuickActionWithEndpoint) => {
    const actionKey = action.key || action.endpoint;
    setActiveQuickAction(actionKey);

    try {
      await triggerDashboardQuickAction({
        endpoint: action.endpoint,
        method: action.method,
        payload: action.payload,
      });
      await loadDashboard();
    } catch (error: unknown) {
      setDashboard((prevState) => ({
        ...prevState,
        message: getApiErrorMessage(error, "שגיאה בביצוע פעולה מהירה"),
      }));
    } finally {
      setActiveQuickAction(null);
    }
  };

  const quickActions =
    dashboard.data && Array.isArray(dashboard.data.quick_actions)
      ? dashboard.data.quick_actions.filter(isValidQuickAction)
      : [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">לוח בקרה</h2>
        <p className="text-gray-600">ברוך הבא למערכת בינדר וחיובים</p>
      </header>

      {dashboard.status === "loading" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-blue-600 rounded-full mx-auto" />
            <p className="mt-4 text-sm text-blue-700">{dashboard.message}</p>
          </div>
        </Card>
      )}

      {dashboard.status === "error" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-500 font-medium">לוח בקרה - יתווסף בהמשך</p>
            <p className="mt-4 text-sm text-orange-700">{dashboard.message}</p>
          </div>
        </Card>
      )}

      {dashboard.status === "ok" && dashboard.data && (
        <DashboardContent
          data={dashboard.data}
          quickActions={quickActions}
          activeQuickAction={activeQuickAction}
          onQuickAction={handleQuickAction}
        />
      )}

      {dashboard.status === "idle" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <p className="text-gray-500">מאתחל...</p>
        </Card>
      )}
    </div>
  );
};
