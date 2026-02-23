import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { RotateCcw } from "lucide-react";
import { WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import type { BindersFiltersBarProps } from "../types";
import { cn } from "../../../utils/utils";

const BINDER_STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "in_office", label: "במשרד" },
  { value: "ready_for_pickup", label: "מוכן לאיסוף" },
];

export const BindersFiltersBar = ({ filters, onFilterChange }: BindersFiltersBarProps) => {
  const activeCount = [filters.status, filters.work_state, filters.client_id].filter(Boolean).length;
  const hasActive = activeCount > 0;

  const handleReset = () => {
    onFilterChange("status", "");
    onFilterChange("work_state", "");
    onFilterChange("client_id", "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className={cn(filters.status && "border-blue-400 ring-1 ring-blue-200")}
        >
          {BINDER_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select
          label="מצב עבודה"
          value={filters.work_state}
          onChange={(e) => onFilterChange("work_state", e.target.value)}
          options={WORK_STATE_OPTIONS}
          className={cn(filters.work_state && "border-blue-400 ring-1 ring-blue-200")}
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
