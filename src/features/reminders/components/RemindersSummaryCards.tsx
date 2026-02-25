import { Bell, Calendar, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import type { Reminder } from "../reminder.types";

interface StatConfig {
  icon: LucideIcon;
  colorBg: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  count: number;
  label: string;
}

interface RemindersSummaryCardsProps {
  reminders: Reminder[];
}

export const RemindersSummaryCards: React.FC<RemindersSummaryCardsProps> = ({
  reminders,
}) => {
  const stats: StatConfig[] = [
    {
      icon: Bell,
      colorBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-700",
      textColor: "text-blue-900",
      count: reminders.filter((r) => r.status === "pending").length,
      label: "תזכורות ממתינות",
    },
    {
      icon: Calendar,
      colorBg: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-200",
      iconColor: "text-green-700",
      textColor: "text-green-900",
      count: reminders.filter((r) => r.status === "sent").length,
      label: "תזכורות שנשלחו",
    },
    {
      icon: AlertTriangle,
      colorBg: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-200",
      iconColor: "text-purple-700",
      textColor: "text-purple-900",
      count: reminders.length,
      label: 'סה"כ תזכורות',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map(
        ({
          icon: Icon,
          colorBg,
          iconBg,
          iconColor,
          textColor,
          count,
          label,
        }) => (
          <Card key={label} variant="elevated" className={colorBg}>
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
                <div className={`text-sm ${iconColor}`}>{label}</div>
              </div>
            </div>
          </Card>
        ),
      )}
    </div>
  );
};
