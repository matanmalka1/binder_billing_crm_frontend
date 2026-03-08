import { AlertTriangle, DollarSign } from "lucide-react";
import { StatsCard } from "../../../components/ui/StatsCard";
import type { AgingReportResponse } from "../../../api/reports.api";

interface AgingReportHeaderProps {
  data: AgingReportResponse;
}

const formatCurrency = (value: number) =>
  `₪${value.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const AgingReportHeader: React.FC<AgingReportHeaderProps> = ({ data }) => (
  <div className="flex flex-col gap-3">
    {data.capped && (
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          הדוח מוגבל ל־{data.cap_limit.toLocaleString("he-IL")} חיובים. ייתכן שחובות נוספים אינם מוצגים וסכום הכולל אינו מלא.
        </span>
      </div>
    )}
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
  </div>
);

AgingReportHeader.displayName = "AgingReportHeader";