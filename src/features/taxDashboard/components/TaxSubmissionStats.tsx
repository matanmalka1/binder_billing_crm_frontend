import { CheckCircle2, FileText, AlertTriangle, Users } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { TaxSubmissionWidgetResponse } from "../../../api/taxDashboard.api";

interface TaxSubmissionStatsProps {
  data?: TaxSubmissionWidgetResponse;
}

TaxSubmissionStats.displayName = "TaxSubmissionStats";

export function TaxSubmissionStats({ data }: TaxSubmissionStatsProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="דוחות שהוגשו"
        value={data.reports_submitted}
        description={`${data.submission_percentage}% מהלקוחות הושלמו`}
        icon={CheckCircle2}
        variant="green"
        trend={{ value: data.submission_percentage, label: "אחוז השלמה" }}
      />
      <StatsCard
        title="בתהליך עבודה"
        value={data.reports_in_progress}
        description="דוחות בשלבי הכנה שונים"
        icon={FileText}
        variant="blue"
      />
      <StatsCard
        title="טרם התחילו"
        value={data.reports_not_started}
        description="ממתינים להתחלת עבודה"
        icon={AlertTriangle}
        variant="orange"
      />
      <StatsCard
        title="סה״כ לקוחות"
        value={data.total_clients}
        description="מסד לקוחות פעיל"
        icon={Users}
        variant="purple"
      />
    </div>
  );
}