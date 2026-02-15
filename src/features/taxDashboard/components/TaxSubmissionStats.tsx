import { CheckCircle2, FileText, AlertTriangle } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { TaxSubmissionWidgetResponse } from "../../../api/taxDashboard.api";

interface Props {
  data?: TaxSubmissionWidgetResponse;
}

export const TaxSubmissionStats: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="דוחות שהוגשו"
        value={data.reports_submitted}
        description={`${data.submission_percentage}% מהלקוחות`}
        icon={CheckCircle2}
        variant="green"
        trend={{ value: data.submission_percentage, label: "אחוז השלמה" }}
      />
      <StatsCard
        title="בתהליך"
        value={data.reports_in_progress}
        description="דוחות בשלבי עבודה שונים"
        icon={FileText}
        variant="blue"
      />
      <StatsCard
        title="טרם התחילו"
        value={data.reports_not_started}
        description="דורשים התחלת עבודה"
        icon={AlertTriangle}
        variant="orange"
      />
      <StatsCard
        title="סה״כ לקוחות"
        value={data.total_clients}
        description="מסד לקוחות פעיל"
        icon={FileText}
        variant="purple"
      />
    </div>
  );
};
