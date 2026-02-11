import React from "react";

interface ClientsFilters {
  has_signals: string;
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
    <label className="block max-w-sm space-y-1">
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
  );
};
