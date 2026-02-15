import { SearchFiltersPrimaryFields } from "./SearchFiltersPrimaryFields";
import { SearchFiltersStatusFields } from "./SearchFiltersStatusFields";
import type { SearchFiltersBarProps } from "../types";

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
