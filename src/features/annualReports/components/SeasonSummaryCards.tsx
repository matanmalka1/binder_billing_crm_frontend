import { FileText, CheckCircle2, AlertTriangle, Clock, Users } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { SeasonSummary } from "../../../api/annualReports.extended.api";

interface Props {
  summary: SeasonSummary;
}

export const SeasonSummaryCards: React.FC<Props> = ({ summary }) => {
  const inProgress =
    summary.collecting_docs +
    summary.docs_complete +
    summary.in_preparation +
    summary.pending_client;

  const done = summary.submitted + summary.accepted + summary.closed;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="סה״כ דוחות"
        value={summary.total}
        description={`שנת מס ${summary.tax_year}`}
        icon={Users}
        variant="blue"
      />
      <StatsCard
        title="בתהליך"
        value={inProgress}
        description="מאיסוף ועד המתנה ללקוח"
        icon={Clock}
        variant="purple"
      />
      <StatsCard
        title="הוגשו / הסתיימו"
        value={done}
        description={`${summary.completion_rate}% השלמה`}
        icon={CheckCircle2}
        variant="green"
        trend={{ value: summary.completion_rate, label: "אחוז הגשה" }}
      />
      <StatsCard
        title="טרם התחיל"
        value={summary.not_started}
        description="דורשים פתיחה"
        icon={FileText}
        variant="orange"
      />
      <StatsCard
        title="באיחור"
        value={summary.overdue_count}
        description="חרגו ממועד הגשה"
        icon={AlertTriangle}
        variant="red"
      />
    </div>
  );
};
