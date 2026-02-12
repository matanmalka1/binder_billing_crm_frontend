import React from "react";
import { Select } from "../../../components/ui/Select";
import type { SearchFilters } from "../types";

interface SearchFiltersStatusFieldsProps {
  filters: SearchFilters;
  onFilterChange: (
    name: keyof SearchFilters,
    value: string | string[],
  ) => void;
}

export const SearchFiltersStatusFields: React.FC<SearchFiltersStatusFieldsProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <>
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
      <Select
        label="סוג אות (רב-בחירה)"
        multiple
        value={filters.signal_type}
        onChange={(event) =>
          onFilterChange(
            "signal_type",
            Array.from(event.target.selectedOptions).map((option) => option.value),
          )
        }
        className="h-28"
      >
        <option value="missing_permanent_documents">חסרים מסמכים קבועים</option>
        <option value="near_sla">קרוב ליעד</option>
        <option value="overdue">באיחור</option>
        <option value="ready_for_pickup">מוכן לאיסוף</option>
        <option value="unpaid_charges">חיובים שלא שולמו</option>
        <option value="idle_binder">תיק לא פעיל</option>
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="יש אותות"
          value={filters.has_signals}
          onChange={(event) => onFilterChange("has_signals", event.target.value)}
        >
          <option value="">הכל</option>
          <option value="true">כן</option>
          <option value="false">לא</option>
        </Select>
        <Select
          label="גודל עמוד"
          value={String(filters.page_size)}
          onChange={(event) => onFilterChange("page_size", event.target.value)}
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
      </div>
    </>
  );
};
