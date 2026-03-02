import { Calendar } from "lucide-react";
import { Input } from "../../../components/ui/Input";

interface AgingReportFiltersProps {
  asOfDate: string;
  onDateChange: (date: string) => void;
}

export const AgingReportFilters: React.FC<AgingReportFiltersProps> = ({
  asOfDate,
  onDateChange,
}) => (
  <div className="flex items-end gap-3">
    <Calendar className="h-5 w-5 text-gray-400 mb-2.5 shrink-0" />
    <Input
      type="date"
      label="נכון לתאריך"
      value={asOfDate}
      onChange={(e) => onDateChange(e.target.value)}
      className="max-w-xs"
    />
  </div>
);

AgingReportFilters.displayName = "AgingReportFilters";