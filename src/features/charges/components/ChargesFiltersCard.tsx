import { Card } from "../../../components/ui/Card";
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

const PAGE_SIZE_OPTIONS = [
  { value: "20", label: "20 בעמוד" },
  { value: "50", label: "50 בעמוד" },
  { value: "100", label: "100 בעמוד" },
];

export const ChargesFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: ChargesFiltersCardProps) => {
  const hasActive = Boolean(filters.client_id || filters.status);

  return (
    <Card title="סינון חיובים">
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
        <Select
          label="גודל עמוד"
          value={String(filters.page_size)}
          onChange={(e) => onFilterChange("page_size", e.target.value)}
          options={PAGE_SIZE_OPTIONS}
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
    </Card>
  );
};

ChargesFiltersCard.displayName = "ChargesFiltersCard";
