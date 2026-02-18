import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { RotateCcw } from "lucide-react";
import { SLA_STATE_OPTIONS, WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import type { BindersFiltersBarProps } from "../types";
import { cn } from "../../../utils/utils";

export const BindersFiltersBar = ({ filters, onFilterChange }: BindersFiltersBarProps) => {
  const activeCount = [filters.work_state, filters.sla_state].filter(Boolean).length;
  const hasActive = activeCount > 0;

  const handleReset = () => {
    onFilterChange("work_state", "");
    onFilterChange("sla_state", "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="מצב עבודה"
          value={filters.work_state}
          onChange={(e) => onFilterChange("work_state", e.target.value)}
          options={WORK_STATE_OPTIONS}
          className={cn(
            filters.work_state && "border-blue-400 ring-1 ring-blue-200"
          )}
        />
        <Select
          label="מצב SLA"
          value={filters.sla_state}
          onChange={(e) => onFilterChange("sla_state", e.target.value)}
          options={SLA_STATE_OPTIONS}
          className={cn(
            filters.sla_state && "border-blue-400 ring-1 ring-blue-200"
          )}
        />

        {/* Reset button aligned to bottom of grid */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!hasActive}
            className={cn(
              "gap-1.5 text-sm transition-opacity",
              !hasActive && "opacity-40 pointer-events-none"
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס
            {hasActive && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active filter pills */}
      {hasActive && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.work_state && (
            <ActivePill
              label={WORK_STATE_OPTIONS.find((o) => o.value === filters.work_state)?.label ?? filters.work_state}
              onRemove={() => onFilterChange("work_state", "")}
            />
          )}
          {filters.sla_state && (
            <ActivePill
              label={SLA_STATE_OPTIONS.find((o) => o.value === filters.sla_state)?.label ?? filters.sla_state}
              onRemove={() => onFilterChange("sla_state", "")}
            />
          )}
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
