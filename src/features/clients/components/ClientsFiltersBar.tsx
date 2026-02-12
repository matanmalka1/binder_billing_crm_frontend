import React from "react";

interface ClientsFilters {
  has_signals: string;
  status: string;
  page_size: string;
}

interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: keyof ClientsFilters, value: string) => void;
}

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">אותות תפעוליים</span>
        <select
          value={filters.has_signals}
          onChange={(event) => onFilterChange("has_signals", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          <option value="true">עם אותות</option>
          <option value="false">ללא אותות</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">סטטוס לקוח</span>
        <select
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          <option value="active">פעיל</option>
          <option value="frozen">מוקפא</option>
          <option value="closed">סגור</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="block text-xs font-medium text-gray-600">גודל עמוד</span>
        <select
          value={filters.page_size}
          onChange={(event) => onFilterChange("page_size", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
  );
};
