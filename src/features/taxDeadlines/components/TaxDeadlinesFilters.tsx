import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import { cn } from "../../../utils/utils";
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_STATUS_OPTIONS,
  getTaxDeadlineStatusLabel,
  getTaxDeadlineTypeLabel,
} from "../constants";
import type { TaxDeadlineFilters } from "../types";

interface TaxDeadlinesFiltersProps {
  filters: TaxDeadlineFilters;
  onChange: (key: string, value: string) => void;
}

export const TaxDeadlinesFilters = ({ filters, onChange }: TaxDeadlinesFiltersProps) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(
    filters.client_name ?? "",
    (v) => onChange("client_name", v),
  );

  const handleReset = () => {
    setSearchDraft("");
    onChange("client_name", "");
    onChange("deadline_type", "");
    onChange("status", "");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="חיפוש לקוח"
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם לקוח..."
          startIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="סוג מועד"
          value={filters.deadline_type}
          onChange={(e) => onChange("deadline_type", e.target.value)}
          options={TAX_DEADLINE_FILTER_TYPE_OPTIONS}
          className={cn(filters.deadline_type && "border-primary-400 ring-1 ring-primary-200")}
        />
        <Select
          label="סטטוס"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          options={TAX_DEADLINE_STATUS_OPTIONS}
          className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.client_name
            ? { key: "client_name", label: `חיפוש: ${filters.client_name}`, onRemove: () => { setSearchDraft(""); onChange("client_name", ""); } }
            : null,
          filters.deadline_type
            ? { key: "deadline_type", label: getTaxDeadlineTypeLabel(filters.deadline_type), onRemove: () => onChange("deadline_type", "") }
            : null,
          filters.status
            ? { key: "status", label: getTaxDeadlineStatusLabel(filters.status), onRemove: () => onChange("status", "") }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};

TaxDeadlinesFilters.displayName = "TaxDeadlinesFilters";
