import React from "react";
import { Card } from "../components/ui/Card";

export const Binders: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">תיקים</h2>
        <p className="text-gray-600">מסך ראשוני לתצוגת תיקים (קריאה בלבד)</p>
      </header>

      <Card>
        <p className="text-gray-600">רשימת תיקים תתווסף בספרינט הבא.</p>
      </Card>
    </div>
  );
};
