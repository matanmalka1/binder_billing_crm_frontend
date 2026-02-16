import { Calendar } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

interface AgingReportFiltersProps {
  asOfDate: string;
  onDateChange: (date: string) => void;
}

export const AgingReportFilters: React.FC<AgingReportFiltersProps> = ({
  asOfDate,
  onDateChange,
}) => {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-gray-400" />
        <Input
          type="date"
          label="נכון לתאריך"
          value={asOfDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
    </Card>
  );
};
