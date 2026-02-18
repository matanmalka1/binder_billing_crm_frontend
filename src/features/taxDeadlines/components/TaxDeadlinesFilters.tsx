import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { FilterBar } from "../../../components/ui/FilterBar";
import type { TaxDeadlineFilters } from "../types";

interface TaxDeadlinesFiltersProps {
  filters: TaxDeadlineFilters;
  onChange: (key: string, value: string) => void;
}

const DEADLINE_TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  { value: "vat", label: "מע״מ" },
  { value: "advance_payment", label: "מקדמות" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "other", label: "אחר" },
];

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "pending", label: "ממתין" },
  { value: "completed", label: "הושלם" },
];

const PAGE_SIZE_OPTIONS = [
  { value: "20", label: "20 בעמוד" },
  { value: "50", label: "50 בעמוד" },
  { value: "100", label: "100 בעמוד" },
];

export const TaxDeadlinesFilters = ({ filters, onChange }: TaxDeadlinesFiltersProps) => {
  const handleReset = () => {
    onChange("client_id", "");
    onChange("deadline_type", "");
    onChange("status", "");
  };

  return (
    <FilterBar title="סינון מועדים" onReset={handleReset}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="מזהה לקוח"
          type="number"
          value={filters.client_id}
          onChange={(e) => onChange("client_id", e.target.value)}
          placeholder="לדוגמה: 123"
        />
        <Select
          label="סוג מועד"
          value={filters.deadline_type}
          onChange={(e) => onChange("deadline_type", e.target.value)}
          options={DEADLINE_TYPE_OPTIONS}
        />
        <Select
          label="סטטוס"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="גודל עמוד"
          value={String(filters.page_size)}
          onChange={(e) => onChange("page_size", e.target.value)}
          options={PAGE_SIZE_OPTIONS}
        />
      </div>
    </FilterBar>
  );
};

TaxDeadlinesFilters.displayName = "TaxDeadlinesFilters";
