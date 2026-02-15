import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Filter, RotateCcw } from "lucide-react";
import { SLA_STATE_OPTIONS, WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import type { BindersFiltersBarProps } from "../types";

export const BindersFiltersBar: React.FC<BindersFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const hasActiveFilters = filters.work_state || filters.sla_state;

  const handleReset = () => {
    onFilterChange("work_state", "");
    onFilterChange("sla_state", "");
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-100 p-2">
            <Filter className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">סינון תיקים</h3>
            <p className="text-xs text-gray-600">סנן לפי מצב עבודה או SLA</p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            איפוס
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Select
            label="מצב עבודה"
            value={filters.work_state}
            onChange={(event) => onFilterChange("work_state", event.target.value)}
            options={WORK_STATE_OPTIONS}
            className={filters.work_state ? "border-primary-300 ring-2 ring-primary-100" : ""}
          />
          {filters.work_state && (
            <p className="text-xs text-gray-500 animate-fade-in">
              מסנן פעיל: {WORK_STATE_OPTIONS.find(o => o.value === filters.work_state)?.label}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Select
            label="מצב SLA"
            value={filters.sla_state}
            onChange={(event) => onFilterChange("sla_state", event.target.value)}
            options={SLA_STATE_OPTIONS}
            className={filters.sla_state ? "border-primary-300 ring-2 ring-primary-100" : ""}
          />
          {filters.sla_state && (
            <p className="text-xs text-gray-500 animate-fade-in">
              מסנן פעיל: {SLA_STATE_OPTIONS.find(o => o.value === filters.sla_state)?.label}
            </p>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm animate-slide-in">
          <span className="font-medium text-primary-900">סינון פעיל:</span>
          <span className="text-primary-700">
            {[filters.work_state, filters.sla_state].filter(Boolean).length} פילטרים
          </span>
        </div>
      )}
    </div>
  );
};