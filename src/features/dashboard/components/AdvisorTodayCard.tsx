import { CalendarClock, Clock, Bell, Receipt } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { AdvisorTodaySection } from "./AdvisorTodaySection";
import { useAdvisorToday } from "../hooks/useAdvisorToday";
import { formatDate } from "../../../utils/utils";

export const AdvisorTodayCard: React.FC = () => {
  const {
    isLoading,
    upcomingDeadlines,
    stuckReports,
    pendingReminders,
    openCharges,
  } = useAdvisorToday();

  if (isLoading) {
    return (
      <Card title="מה לעשות היום">
        <p className="text-sm text-gray-400 text-center py-4">טוען...</p>
      </Card>
    );
  }

  return (
    <Card
      title="מה לעשות היום"
      subtitle="סיכום פעולות נדרשות"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AdvisorTodaySection
          icon={CalendarClock}
          title="מועדי מס השבוע"
          emptyLabel="אין מועדים קרובים"
          badgeVariant="error"
          items={upcomingDeadlines.map((d) => ({
            id: d.id,
            label: `לקוח #${d.client_id} — ${d.deadline_type}`,
            sublabel: formatDate(d.due_date),
          }))}
        />

        <AdvisorTodaySection
          icon={Clock}
          title="לקוחות תקועים"
          emptyLabel="אין דוחות תקועים"
          badgeVariant="warning"
          items={stuckReports.map((r) => ({
            id: r.id,
            label: `לקוח #${r.client_id} — ${r.tax_year}`,
            sublabel: `שלב: ${r.stage}`,
          }))}
        />

        <AdvisorTodaySection
          icon={Bell}
          title="ממתינים למסמכים"
          emptyLabel="אין תזכורות תלויות"
          badgeVariant="info"
          items={pendingReminders.map((r) => ({
            id: r.id,
            label: `לקוח #${r.client_id}`,
            sublabel: r.message.slice(0, 40),
          }))}
        />

        <AdvisorTodaySection
          icon={Receipt}
          title="חיובים פתוחים"
          emptyLabel="אין חיובים ישנים"
          badgeVariant="warning"
          items={openCharges.map((c) => ({
            id: c.id,
            label: `חיוב #${c.id} — לקוח #${c.client_id}`,
            sublabel: c.issued_at ? formatDate(c.issued_at) : "",
          }))}
        />
      </div>
    </Card>
  );
};
