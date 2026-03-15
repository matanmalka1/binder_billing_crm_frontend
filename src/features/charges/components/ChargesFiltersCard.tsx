import { ToolbarContainer } from "../../../components/ui/ToolbarContainer";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { RotateCcw } from "lucide-react";
import type { ChargesFilters } from "../types";

interface ChargesFiltersCardProps {
  filters: ChargesFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "draft", label: "טיוטה" },
  { value: "issued", label: "הונפק" },
  { value: "paid", label: "שולם" },
  { value: "canceled", label: "בוטל" },
];

const CHARGE_TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  { value: "one_time", label: "חד פעמי" },
  { value: "retainer", label: "ריטיינר" },
  { value: "hourly", label: "שעתי" },
];

export const ChargesFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: ChargesFiltersCardProps) => {
  const hasActive = Boolean(filters.client_id || filters.status || filters.charge_type);

  return (
    <ToolbarContainer>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px] max-w-[200px]">
          <Input
            label="מזהה לקוח"
            type="number"
            min={1}
            value={filters.client_id}
            onChange={(e) => onFilterChange("client_id", e.target.value)}
            placeholder="לדוגמה: 123"
          />
        </div>
        <div className="flex-1 min-w-[140px] max-w-[180px]">
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="flex-1 min-w-[140px] max-w-[180px]">
          <Select
            label="סוג חיוב"
            value={filters.charge_type}
            onChange={(e) => onFilterChange("charge_type", e.target.value)}
            options={CHARGE_TYPE_OPTIONS}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!hasActive}
          className="gap-1.5 mb-0.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          איפוס
        </Button>
      </div>
    </ToolbarContainer>
  );
};

ChargesFiltersCard.displayName = "ChargesFiltersCard";
