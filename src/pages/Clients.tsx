import React from "react";
import { Card } from "../components/ui/Card";

export const Clients: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">לקוחות</h2>
        <p className="text-gray-600">מסך ראשוני לתצוגת לקוחות (קריאה בלבד)</p>
      </header>

      <Card>
        <p className="text-gray-600">רשימת לקוחות תתווסף בספרינט הבא.</p>
      </Card>
    </div>
  );
};
