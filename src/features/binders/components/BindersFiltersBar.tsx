import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { RotateCcw, Search } from "lucide-react";
import { WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import { BINDER_STATUS_OPTIONS } from "../constants";
import type { BindersFiltersBarProps } from "../types";
import { cn, buildYearOptions } from "../../../utils/utils";

const YEAR_OPTIONS = [
  { value: "", label: "כל התקופות" },
  ...buildYearOptions(),
];

export const BindersFiltersBar = ({ filters, onFilterChange }: BindersFiltersBarProps) => {
  const [searchDraft, setSearchDraft] = useState(filters.query ?? "");
  const [debouncedSearch] = useDebounce(searchDraft, 350);

  // Sync draft when URL resets externally
  useEffect(() => {
    setSearchDraft(filters.query ?? "");
  }, [filters.query]);

  // Propagate debounced value
  useEffect(() => {
    if (debouncedSearch !== (filters.query ?? "")) {
      onFilterChange("query", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActive = Boolean(filters.status || filters.work_state || filters.query || filters.year);

  const handleReset = () => {
    setSearchDraft("");
    onFilterChange("status", "");
    onFilterChange("work_state", "");
    onFilterChange("query", "");
    onFilterChange("year", "");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Input
          label="חיפוש"
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם לקוח או מספר קלסר..."
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[...BINDER_STATUS_OPTIONS]}
          className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
        />
        <Select
          label="מצב עבודה"
          value={filters.work_state ?? ""}
          onChange={(e) => onFilterChange("work_state", e.target.value)}
          options={WORK_STATE_OPTIONS}
          className={cn(filters.work_state && "border-primary-400 ring-1 ring-primary-200")}
        />
        <Select
          label="תקופה"
          value={filters.year ?? ""}
          onChange={(e) => onFilterChange("year", e.target.value)}
          options={YEAR_OPTIONS}
          className={cn(filters.year && "border-primary-400 ring-1 ring-primary-200")}
        />
      </div>

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {filters.query && (
            <ActivePill label={`חיפוש: ${filters.query}`} onRemove={() => { setSearchDraft(""); onFilterChange("query", ""); }} />
          )}
          {filters.status && (
            <ActivePill
              label={BINDER_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status}
              onRemove={() => onFilterChange("status", "")}
            />
          )}
          {filters.work_state && (
            <ActivePill
              label={WORK_STATE_OPTIONS.find((o) => o.value === filters.work_state)?.label ?? filters.work_state}
              onRemove={() => onFilterChange("work_state", "")}
            />
          )}
          {filters.year && (
            <ActivePill label={filters.year} onRemove={() => onFilterChange("year", "")} />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס
          </Button>
        </div>
      )}
    </div>
  );
};

BindersFiltersBar.displayName = "BindersFiltersBar";

/* ─── Sub-component ─────────────────────────────────────────── */

interface ActivePillProps {
  label: string;
  onRemove: () => void;
}

const ActivePill: React.FC<ActivePillProps> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-primary-800">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-200 transition-colors"
      aria-label={`הסר סינון ${label}`}
    >
      ×
    </button>
  </span>
);
ActivePill.displayName = "ActivePill";
