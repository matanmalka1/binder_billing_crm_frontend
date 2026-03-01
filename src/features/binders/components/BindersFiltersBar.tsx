import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { RotateCcw } from "lucide-react";
import { WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import { BINDER_STATUS_OPTIONS } from "../types";
import type { BindersFiltersBarProps } from "../types";
import { cn } from "../../../utils/utils";

export const BindersFiltersBar = ({ filters, onFilterChange }: BindersFiltersBarProps) => {
  const activeCount = [
    filters.status,
    filters.work_state,
    filters.client_id,
    filters.client_name,
    filters.binder_number,
  ].filter(Boolean).length;
  const hasActive = activeCount > 0;

  const handleReset = () => {
    onFilterChange("status", "");
    onFilterChange("work_state", "");
    onFilterChange("client_id", "");
    onFilterChange("client_name", "");
    onFilterChange("binder_number", "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          label="שם לקוח"
          type="text"
          value={filters.client_name ?? ""}
          onChange={(e) => onFilterChange("client_name", e.target.value)}
          placeholder="חיפוש לפי שם..."
        />
        <Input
          label="מספר קלסר"
          type="text"
          value={filters.binder_number ?? ""}
          onChange={(e) => onFilterChange("binder_number", e.target.value)}
          placeholder="BND-..."
        />
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[...BINDER_STATUS_OPTIONS]}
          className={cn(filters.status && "border-blue-400 ring-1 ring-blue-200")}
        />
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
          {filters.client_name && (
            <ActivePill label={`שם: ${filters.client_name}`} onRemove={() => onFilterChange("client_name", "")} />
          )}
          {filters.binder_number && (
            <ActivePill label={`קלסר: ${filters.binder_number}`} onRemove={() => onFilterChange("binder_number", "")} />
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
