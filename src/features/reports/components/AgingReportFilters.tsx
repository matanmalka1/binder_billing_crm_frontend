import { DatePicker } from "../../../components/ui/DatePicker";

interface AgingReportFiltersProps {
  asOfDate: string;
  onDateChange: (date: string) => void;
}

export const AgingReportFilters: React.FC<AgingReportFiltersProps> = ({
  asOfDate,
  onDateChange,
}) => (
  <div className="max-w-xs">
    <DatePicker
      label="נכון לתאריך"
      value={asOfDate}
      onChange={onDateChange}
    />
  </div>
);

AgingReportFilters.displayName = "AgingReportFilters";