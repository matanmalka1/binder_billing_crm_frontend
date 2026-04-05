import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
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
    filters.business_name ?? "",
    (v) => onChange("business_name", v),
  );

  const handleReset = () => {
    setSearchDraft("");
    onChange("business_name", "");
    onChange("deadline_type", "");
    onChange("status", "");
    onChange("due_from", "");
    onChange("due_to", "");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="חיפוש עסק"
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם עסק..."
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
        <DatePicker
          label="מתאריך"
          value={filters.due_from}
          onChange={(v) => onChange("due_from", v)}
        />
        <DatePicker
          label="עד תאריך"
          value={filters.due_to}
          onChange={(v) => onChange("due_to", v)}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.business_name
            ? { key: "business_name", label: `עסק: ${filters.business_name}`, onRemove: () => { setSearchDraft(""); onChange("business_name", ""); } }
            : null,
          filters.deadline_type
            ? { key: "deadline_type", label: getTaxDeadlineTypeLabel(filters.deadline_type), onRemove: () => onChange("deadline_type", "") }
            : null,
          filters.status
            ? { key: "status", label: getTaxDeadlineStatusLabel(filters.status), onRemove: () => onChange("status", "") }
            : null,
          filters.due_from
            ? { key: "due_from", label: `מתאריך: ${filters.due_from}`, onRemove: () => onChange("due_from", "") }
            : null,
          filters.due_to
            ? { key: "due_to", label: `עד: ${filters.due_to}`, onRemove: () => onChange("due_to", "") }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};

TaxDeadlinesFilters.displayName = "TaxDeadlinesFilters";
