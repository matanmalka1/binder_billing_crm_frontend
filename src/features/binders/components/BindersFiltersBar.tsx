import React from "react";
import { Select } from "../../../components/ui/Select";
import type { BindersFiltersBarProps } from "../types";

export const BindersFiltersBar: React.FC<BindersFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Select
        label="מצב עבודה"
        value={filters.work_state}
        onChange={(event) => onFilterChange("work_state", event.target.value)}
      >
        <option value="">הכל</option>
        <option value="waiting_for_work">ממתין לטיפול</option>
        <option value="in_progress">בטיפול</option>
        <option value="completed">הושלם</option>
      </Select>

      <Select
        label="מצב SLA"
        value={filters.sla_state}
        onChange={(event) => onFilterChange("sla_state", event.target.value)}
      >
        <option value="">הכל</option>
        <option value="on_track">במסלול</option>
        <option value="approaching">מתקרב ליעד</option>
        <option value="overdue">באיחור</option>
      </Select>
    </div>
  );
};
