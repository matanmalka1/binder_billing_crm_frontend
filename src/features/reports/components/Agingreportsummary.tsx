import { DollarSign } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { AgingReportResponse } from "../../../api/reports.api";

const formatCurrency = (
  value?: number,
  options?: Intl.NumberFormatOptions,
) => `₪${(value ?? 0).toLocaleString("he-IL", options)}`;

interface AgingReportSummaryProps {
  data: AgingReportResponse;
}

export const AgingReportSummary: React.FC<AgingReportSummaryProps> = ({
  data,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="סה״כ חובות"
        value={formatCurrency(data.total_outstanding)}
        icon={DollarSign}
        variant="blue"
        description="יתרות פתוחות"
      />
      <StatsCard
        title="שוטף (0-30)"
        value={formatCurrency(data.summary?.current)}
        icon={DollarSign}
        variant="green"
        description="תוך 30 יום"
      />
      <StatsCard
        title="31-60 ימים"
        value={formatCurrency(data.summary?.days_30)}
        icon={DollarSign}
        variant="orange"
        description="חודש שני"
      />
      <StatsCard
        title="61-90 ימים"
        value={formatCurrency(data.summary?.days_60)}
        icon={DollarSign}
        variant="orange"
        description="חודש שלישי"
      />
      <StatsCard
        title="90+ ימים"
        value={formatCurrency(data.summary?.days_90_plus)}
        icon={DollarSign}
        variant="red"
        description="דורש טיפול"
      />
    </div>
  );
};
