import { DollarSign } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { AgingReportResponse } from "../../../api/reports.api";

interface AgingReportHeaderProps {
  data: AgingReportResponse;
}

const formatCurrency = (value: number) =>
  `₪${value.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const AgingReportHeader: React.FC<AgingReportHeaderProps> = ({ data }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <StatsCard
      title='סה"כ חובות'
      value={formatCurrency(data.total_outstanding)}
      icon={DollarSign}
      variant="blue"
      description={`${data.items.length} לקוחות עם יתרות פתוחות`}
      className="sm:max-w-xs"
    />
    <p className="text-sm text-gray-500 self-end">
      נוצר בתאריך: {new Date(data.report_date).toLocaleString("he-IL")}
    </p>
  </div>
);

AgingReportHeader.displayName = "AgingReportHeader";