
import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { api } from "../api/client";

type HealthState = {
  status: "idle" | "loading" | "ok" | "error";
  message: string;
};

export const Dashboard: React.FC = () => {
  const [health, setHealth] = useState<HealthState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadHealth = async () => {
      setHealth({ status: "loading", message: "בודק חיבור לשרת..." });
      try {
        await api.get("/health");
        if (!mounted) return;
        setHealth({ status: "ok", message: "החיבור לשרת תקין" });
      } catch {
        if (!mounted) return;
        setHealth({
          status: "error",
          message: "לא התקבלה תגובה מהשרת (מצב קריאה בלבד)",
        });
      }
    };

    loadHealth();
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

      <Card className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500 font-medium">לוח בקרה - יתווסף בהמשך</p>
          <div className="mt-4 w-12 h-1 bg-blue-100 mx-auto rounded" />
          {health.status !== "idle" && (
            <p
              className={
                health.status === "ok"
                  ? "mt-4 text-sm text-green-700"
                  : health.status === "loading"
                    ? "mt-4 text-sm text-blue-700"
                    : "mt-4 text-sm text-orange-700"
              }
            >
              {health.message}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
