import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { api } from "../api/client";

type DashboardData = {
  total_clients: number;
  active_binders: number;
  overdue_binders: number;
  binders_due_today: number;
  binders_due_this_week: number;
};

type DashboardState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
  data: DashboardData | null;
};

export const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardState>({
    status: "idle",
    message: "",
    data: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setDashboard({ status: "loading", message: "טוען נתוני לוח בקרה...", data: null });
      try {
        // ✅ CORRECT ENDPOINT per spec
        const response = await api.get<DashboardData>("/dashboard/overview");
        if (!mounted) return;
        setDashboard({
          status: "ok",
          message: "נתונים נטענו בהצלחה",
          data: response.data,
        });
      } catch (error) {
        if (!mounted) return;
        setDashboard({
          status: "error",
          message: "לא התקבלה תגובה מהשרת (מצב קריאה בלבד)",
          data: null,
        });
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="לקוחות">
            <div className="text-3xl font-bold text-blue-600">{dashboard.data.total_clients}</div>
            <p className="text-sm text-gray-600 mt-1">סך הכל לקוחות במערכת</p>
          </Card>

          <Card title="תיקים פעילים">
            <div className="text-3xl font-bold text-green-600">{dashboard.data.active_binders}</div>
            <p className="text-sm text-gray-600 mt-1">תיקים שטרם הוחזרו</p>
          </Card>

          <Card title="תיקים באיחור">
            <div className="text-3xl font-bold text-red-600">{dashboard.data.overdue_binders}</div>
            <p className="text-sm text-gray-600 mt-1">חרגו מ-90 יום</p>
          </Card>

          <Card title="תיקים ליום זה">
            <div className="text-3xl font-bold text-orange-600">{dashboard.data.binders_due_today}</div>
            <p className="text-sm text-gray-600 mt-1">מועד החזרה היום</p>
          </Card>

          <Card title="תיקים לשבוע זה">
            <div className="text-3xl font-bold text-purple-600">{dashboard.data.binders_due_this_week}</div>
            <p className="text-sm text-gray-600 mt-1">מועד החזרה תוך 7 ימים</p>
          </Card>
        </div>
      )}

      {dashboard.status === "idle" && (
        <Card className="min-h-[200px] flex items-center justify-center">
          <p className="text-gray-500">מאתחל...</p>
        </Card>
      )}
    </div>
  );
};
