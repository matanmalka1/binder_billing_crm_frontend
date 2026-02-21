import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { RotateCcw } from "lucide-react";
import type { VatWorkItemsFilters } from "../types";

interface VatWorkItemsFiltersCardProps {
  filters: VatWorkItemsFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "pending_materials", label: "ממתין לחומרים" },
  { value: "material_received", label: "חומרים התקבלו" },
  { value: "data_entry_in_progress", label: "הקלדה בתהליך" },
  { value: "ready_for_review", label: "ממתין לבדיקה" },
  { value: "filed", label: "הוגש" },
];

const PAGE_SIZE_OPTIONS = [
  { value: "20", label: "20 בעמוד" },
  { value: "50", label: "50 בעמוד" },
  { value: "100", label: "100 בעמוד" },
];

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const hasActive = Boolean(filters.status);

  return (
    <Card title='סינון תיקי מע"מ'>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="סטטוס"
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

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
