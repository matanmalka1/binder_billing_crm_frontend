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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
      <StatsCard
        title="סה״כ חובות"
        value={formatCurrency(data.total_outstanding)}
        icon={DollarSign}
        variant="blue"
        description="יתרות פתוחות"
      />
    </div>
  );
};
