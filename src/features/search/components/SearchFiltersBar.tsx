import React from "react";
import type { SearchFilters } from "../types";
import { SearchFiltersPrimaryFields } from "./SearchFiltersPrimaryFields";
import { SearchFiltersStatusFields } from "./SearchFiltersStatusFields";

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
      <SearchFiltersPrimaryFields filters={filters} onFilterChange={onFilterChange} />
      <SearchFiltersStatusFields filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
};
