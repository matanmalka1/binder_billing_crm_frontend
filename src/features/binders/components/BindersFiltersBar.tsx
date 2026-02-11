import React from "react";

interface BindersFilters {
  work_state: string;
  sla_state: string;
}

interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}

export const BindersFiltersBar: React.FC<BindersFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">מצב עבודה</span>
        <select
          value={filters.work_state}
          onChange={(event) => onFilterChange("work_state", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          <option value="waiting_for_work">ממתין לטיפול</option>
          <option value="in_progress">בטיפול</option>
          <option value="completed">הושלם</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">מצב SLA</span>
        <select
          value={filters.sla_state}
          onChange={(event) => onFilterChange("sla_state", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          <option value="on_track">במסלול</option>
          <option value="approaching">מתקרב ליעד</option>
          <option value="overdue">באיחור</option>
        </select>
      </label>
    </div>
  );
};
