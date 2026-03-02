import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { RotateCcw } from "lucide-react";
import type { VatWorkItemsFilters } from "../types";

interface VatWorkItemsFiltersCardProps {
  filters: VatWorkItemsFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
  stats?: { pending: number; typing: number; review: number; filed: number };
}

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "pending_materials", label: "ממתין לחומרים" },
  { value: "material_received", label: "חומרים התקבלו" },
  { value: "data_entry_in_progress", label: "הקלדה בתהליך" },
  { value: "ready_for_review", label: "ממתין לבדיקה" },
  { value: "filed", label: "הוגש" },
];

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
  stats,
}: VatWorkItemsFiltersCardProps) => {
  const hasActive = Boolean(filters.status);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      {/* Filter controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="mb-0.5 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס
          </Button>
        )}
      </div>

      {/* Inline stats */}
      {stats && (
        <div className="mr-auto flex items-center divide-x divide-x-reverse divide-gray-200">
          <div className="flex items-center gap-1.5 px-4 first:pr-0">
            <span className="text-lg font-bold tabular-nums text-orange-600">{stats.pending}</span>
            <span className="text-xs text-gray-500">ממתין לחומרים</span>
          </div>
          <div className="flex items-center gap-1.5 px-4">
            <span className="text-lg font-bold tabular-nums text-primary-600">{stats.typing}</span>
            <span className="text-xs text-gray-500">בהקלדה</span>
          </div>
          <div className="flex items-center gap-1.5 px-4">
            <span className="text-lg font-bold tabular-nums text-yellow-600">{stats.review}</span>
            <span className="text-xs text-gray-500">ממתין לבדיקה</span>
          </div>
          <div className="flex items-center gap-1.5 px-4">
            <span className="text-lg font-bold tabular-nums text-green-600">{stats.filed}</span>
            <span className="text-xs text-gray-500">הוגש</span>
          </div>
        </div>
      )}
    </div>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
