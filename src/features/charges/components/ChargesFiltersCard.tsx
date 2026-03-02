import { InlineToolbar } from "../../../components/ui/InlineToolbar";
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

export const ChargesFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: ChargesFiltersCardProps) => {
  const hasActive = Boolean(filters.client_id || filters.status);

  return (
    <InlineToolbar>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="מזהה לקוח"
          type="number"
          min={1}
          value={filters.client_id}
          onChange={(e) => onFilterChange("client_id", e.target.value)}
          placeholder="לדוגמה: 123"
        />
        <Select
          label="סטטוס חיוב"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={STATUS_OPTIONS}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!hasActive}
            className="gap-1.5 w-full justify-center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס סינון
          </Button>
        </div>
      </div>
    </InlineToolbar>
  );
};

ChargesFiltersCard.displayName = "ChargesFiltersCard";
