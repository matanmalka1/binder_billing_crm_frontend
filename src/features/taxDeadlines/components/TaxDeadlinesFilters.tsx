import { RotateCcw } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
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

export const TaxDeadlinesFilters = ({ filters, onChange }: TaxDeadlinesFiltersProps) => {
  const hasActive = Boolean(filters.client_id || filters.deadline_type || filters.status);

  const handleReset = () => {
    onChange("client_id", "");
    onChange("deadline_type", "");
    onChange("status", "");
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-36">
        <Input
          label="מזהה לקוח"
          type="number"
          value={filters.client_id}
          onChange={(e) => onChange("client_id", e.target.value)}
          placeholder="לדוגמה: 123"
        />
      </div>
      <div className="w-40">
        <Select
          label="סוג מועד"
          value={filters.deadline_type}
          onChange={(e) => onChange("deadline_type", e.target.value)}
          options={DEADLINE_TYPE_OPTIONS}
        />
      </div>
      <div className="w-36">
        <Select
          label="סטטוס"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          options={STATUS_OPTIONS}
        />
      </div>
      {hasActive && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="mb-0.5 gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          איפוס
        </Button>
      )}
    </div>
  );
};

TaxDeadlinesFilters.displayName = "TaxDeadlinesFilters";
