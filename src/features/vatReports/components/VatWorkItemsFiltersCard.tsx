import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import { Input } from "../../../components/ui/Input";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import { ToolbarContainer } from "../../../components/ui/ToolbarContainer";
import { cn } from "../../../utils/utils";
import { VAT_WORK_ITEMS_STATUS_OPTIONS } from "../constants";
import type { VatWorkItemsFiltersCardProps } from "../types";

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
          <Input
            label="חיפוש לקוח"
            placeholder="שם לקוח..."
            value={clientSearchDraft}
            onChange={(e) => setClientSearchDraft(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
          <Input
            label="תקופה"
            placeholder="YYYY-MM"
            value={filters.period}
            onChange={(e) => onFilterChange("period", e.target.value)}
            dir="ltr"
            className={cn(
              filters.period && "border-primary-400 ring-1 ring-primary-200",
            )}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <SelectDropdown
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              options={VAT_WORK_ITEMS_STATUS_OPTIONS}
              className={cn(
                filters.status && "border-primary-400 ring-1 ring-primary-200",
              )}
            />
          </div>
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? {
                  key: "status",
                  label:
                    VAT_WORK_ITEMS_STATUS_OPTIONS.find(
                      (o) => o.value === filters.status,
                    )?.label ?? filters.status,
                  onRemove: () => onFilterChange("status", ""),
                }
              : null,
            filters.period
              ? {
                  key: "period",
                  label: `תקופה: ${filters.period}`,
                  onRemove: () => onFilterChange("period", ""),
                }
              : null,
            filters.clientSearch
              ? {
                  key: "clientSearch",
                  label: `חיפוש: ${filters.clientSearch}`,
                  onRemove: () => {
                    setClientSearchDraft("");
                    onFilterChange("clientSearch", "");
                  },
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
