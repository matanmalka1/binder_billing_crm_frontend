import React from "react";
import type { SearchFilters } from "../types";

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFilterChange: (
    name: keyof SearchFilters,
    value: string | string[],
  ) => void;
}

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">חיפוש חופשי</span>
        <input
          type="text"
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder="שם לקוח / מספר תיק"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">שם לקוח</span>
        <input
          type="text"
          value={filters.client_name}
          onChange={(event) => onFilterChange("client_name", event.target.value)}
          placeholder="שם לקוח"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">ת.ז / ח.פ</span>
        <input
          type="text"
          value={filters.id_number}
          onChange={(event) => onFilterChange("id_number", event.target.value)}
          placeholder="מספר מזהה"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">מספר תיק</span>
        <input
          type="text"
          value={filters.binder_number}
          onChange={(event) => onFilterChange("binder_number", event.target.value)}
          placeholder="BND-..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

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

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">סוג אות (רב-בחירה)</span>
        <select
          multiple
          value={filters.signal_type}
          onChange={(event) =>
            onFilterChange(
              "signal_type",
              Array.from(event.target.selectedOptions).map((option) => option.value),
            )
          }
          className="h-28 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="missing_permanent_documents">חסרים מסמכים קבועים</option>
          <option value="near_sla">קרוב ליעד</option>
          <option value="overdue">באיחור</option>
          <option value="ready_for_pickup">מוכן לאיסוף</option>
          <option value="unpaid_charges">חיובים שלא שולמו</option>
          <option value="idle_binder">תיק לא פעיל</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="block text-xs font-medium text-gray-600">יש אותות</span>
          <select
            value={filters.has_signals}
            onChange={(event) => onFilterChange("has_signals", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">הכל</option>
            <option value="true">כן</option>
            <option value="false">לא</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-medium text-gray-600">גודל עמוד</span>
          <select
            value={String(filters.page_size)}
            onChange={(event) => onFilterChange("page_size", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
      </div>
    </div>
  );
};
