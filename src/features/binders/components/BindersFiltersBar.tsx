import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { RotateCcw, Search } from "lucide-react";
import { WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import { BINDER_STATUS_OPTIONS } from "../types";
import type { BindersFiltersBarProps } from "../types";
import { cn } from "../../../utils/utils";

export const BindersFiltersBar = ({ filters, onFilterChange }: BindersFiltersBarProps) => {
  const activeCount = [
    filters.status,
    filters.work_state,
    filters.query,
  ].filter(Boolean).length;
  const hasActive = activeCount > 0;

  const handleReset = () => {
    onFilterChange("status", "");
    onFilterChange("work_state", "");
    onFilterChange("query", "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 mt-3 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            label="חיפוש"
            type="text"
            value={filters.query ?? ""}
            onChange={(e) => onFilterChange("query", e.target.value)}
            placeholder="שם לקוח או מספר קלסר..."
            className="pr-9"
          />
        </div>
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[...BINDER_STATUS_OPTIONS]}
          className={cn(filters.status && "border-blue-400 ring-1 ring-blue-200")}
        />
        <Select
          label="מצב עבודה"
          value={filters.work_state ?? ""}
          onChange={(e) => onFilterChange("work_state", e.target.value)}
          options={WORK_STATE_OPTIONS}
          className={cn(filters.work_state && "border-blue-400 ring-1 ring-blue-200")}
        />
      </div>

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {filters.query && (
            <ActivePill label={`חיפוש: ${filters.query}`} onRemove={() => onFilterChange("query", "")} />
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
  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-blue-800">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
      aria-label={`הסר סינון ${label}`}
    >
      ×
    </button>
  </span>
);
ActivePill.displayName = "ActivePill";
