import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { ToolbarContainer } from "../../../components/ui/ToolbarContainer";
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

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const hasActive = Boolean(filters.status || filters.period || filters.clientSearch);

  return (
    <ToolbarContainer onReset={hasActive ? onClear : undefined}>
      <div className="flex flex-wrap items-end gap-3" dir="rtl">
        <div className="w-48">
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="w-36">
          <Input
            label="תקופה"
            placeholder="YYYY-MM"
            value={filters.period}
            onChange={(e) => onFilterChange("period", e.target.value)}
            dir="ltr"
          />
        </div>
        <div className="w-52">
          <Input
            label="חיפוש לקוח"
            placeholder="שם לקוח..."
            value={filters.clientSearch}
            onChange={(e) => onFilterChange("clientSearch", e.target.value)}
          />
        </div>
      </div>
    </ToolbarContainer>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
