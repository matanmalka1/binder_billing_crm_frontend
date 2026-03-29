import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Select } from "../../../components/ui/inputs/Select";
import { Input } from "../../../components/ui/inputs/Input";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { Search } from "lucide-react";
import { BINDER_STATUS_OPTIONS } from "../constants";
import type { BindersFiltersBarProps } from "../types";
import { cn, buildYearOptions } from "../../../utils/utils";

const YEAR_OPTIONS = [
  { value: "", label: "כל התקופות" },
  ...buildYearOptions(),
];

export const BindersFiltersBar = ({
  filters,
  onFilterChange,
}: BindersFiltersBarProps) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(
    filters.query ?? "",
    (v) => onFilterChange("query", v),
  );

  const handleReset = () => {
    setSearchDraft("");
    onFilterChange("status", "");
    onFilterChange("query", "");
    onFilterChange("year", "");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="חיפוש"
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם לקוח או מספר קלסר..."
          startIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[...BINDER_STATUS_OPTIONS]}
          className={cn(
            filters.status && "border-primary-400 ring-1 ring-primary-200",
          )}
        />
        <Select
          label="תקופה"
          value={filters.year ?? ""}
          onChange={(e) => onFilterChange("year", e.target.value)}
          options={YEAR_OPTIONS}
          className={cn(
            filters.year && "border-primary-400 ring-1 ring-primary-200",
          )}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.query
            ? {
                key: "query",
                label: `חיפוש: ${filters.query}`,
                onRemove: () => {
                  setSearchDraft("");
                  onFilterChange("query", "");
                },
              }
            : null,
          filters.status
            ? {
                key: "status",
                label:
                  BINDER_STATUS_OPTIONS.find((o) => o.value === filters.status)
                    ?.label ?? filters.status,
                onRemove: () => onFilterChange("status", ""),
              }
            : null,
          filters.year
            ? {
                key: "year",
                label: filters.year,
                onRemove: () => onFilterChange("year", ""),
              }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};

BindersFiltersBar.displayName = "BindersFiltersBar";
