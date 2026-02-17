import { Bell, Calendar, AlertTriangle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import type { Reminder } from "../reminder.types";

interface RemindersSummaryCardsProps {
  reminders: Reminder[];
}

export const RemindersSummaryCards: React.FC<RemindersSummaryCardsProps> = ({
  reminders,
}) => {
  const pendingCount = reminders.filter((r) => r.status === "pending").length;
  const sentCount = reminders.filter((r) => r.status === "sent").length;
  const totalCount = reminders.length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card
        variant="elevated"
        className="bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-200 p-3">
            <Bell className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{pendingCount}</div>
            <div className="text-sm text-blue-700">תזכורות ממתינות</div>
          </div>
        </div>
      </Card>

      <Card
        variant="elevated"
        className="bg-gradient-to-br from-green-50 to-green-100"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-green-200 p-3">
            <Calendar className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">{sentCount}</div>
            <div className="text-sm text-green-700">תזכורות שנשלחו</div>
          </div>
        </div>
      </Card>

      <Card
        variant="elevated"
        className="bg-gradient-to-br from-purple-50 to-purple-100"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-200 p-3">
            <AlertTriangle className="h-6 w-6 text-purple-700" />
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{totalCount}</div>
            <div className="text-sm text-purple-700">סה״כ תזכורות</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
