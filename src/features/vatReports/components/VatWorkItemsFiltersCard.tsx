import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import { ToolbarContainer } from "../../../components/ui/ToolbarContainer";
import { cn } from "../../../utils/utils";
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
  const [clientSearchDraft, setClientSearchDraft] = useSearchDebounce(
    filters.clientSearch,
    (v) => onFilterChange("clientSearch", v),
  );

  const handleReset = () => {
    setClientSearchDraft("");
    onClear();
  };

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
            className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
          />
          <Input
            label="תקופה"
            placeholder="YYYY-MM"
            value={filters.period}
            onChange={(e) => onFilterChange("period", e.target.value)}
            dir="ltr"
            className={cn(filters.period && "border-primary-400 ring-1 ring-primary-200")}
          />
          <Input
            label="חיפוש לקוח"
            placeholder="שם לקוח..."
            value={clientSearchDraft}
            onChange={(e) => setClientSearchDraft(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? { key: "status", label: STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status, onRemove: () => onFilterChange("status", "") }
              : null,
            filters.period
              ? { key: "period", label: `תקופה: ${filters.period}`, onRemove: () => onFilterChange("period", "") }
              : null,
            filters.clientSearch
              ? { key: "clientSearch", label: `חיפוש: ${filters.clientSearch}`, onRemove: () => { setClientSearchDraft(""); onFilterChange("clientSearch", ""); } }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
