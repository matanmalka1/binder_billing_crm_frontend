import { Card } from "../../../components/ui/Card";
import type { AgingReportResponse } from "../../../api/reports.api";

interface AgingReportMetadataProps {
  data: AgingReportResponse;
}

export const AgingReportMetadata: React.FC<AgingReportMetadataProps> = ({
  data,
}) => {
  return (
    <Card variant="elevated" className="bg-gray-50">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          נוצר בתאריך: {new Date(data.report_date).toLocaleString("he-IL")}
        </div>
        <div>סה״כ {data.items.length} לקוחות עם חובות פתוחים</div>
      </div>
    </Card>
  );
};
