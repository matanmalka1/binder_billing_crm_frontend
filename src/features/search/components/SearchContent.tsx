import React from "react";
import { Card } from "../../../components/ui/Card";
import type { SearchFilters, SearchResult } from "../types";
import { SearchFiltersBar } from "./SearchFiltersBar";
import { SearchTable } from "./SearchTable";

interface SearchContentProps {
  total: number;
  filters: SearchFilters;
  results: SearchResult[];
  onFilterChange: (name: keyof SearchFilters, value: string) => void;
}

export const SearchContent: React.FC<SearchContentProps> = ({
  total,
  filters,
  results,
  onFilterChange,
}) => {
  return (
    <Card title="חיפוש מתקדם">
      <div className="space-y-4">
        <SearchFiltersBar filters={filters} onFilterChange={onFilterChange} />
        <p className="text-sm text-gray-600">נמצאו {total} תוצאות</p>
        {results.length > 0 ? (
          <SearchTable results={results} />
        ) : (
          <p className="py-8 text-center text-gray-500">אין תוצאות להצגה</p>
        )}
      </div>
    </Card>
  );
};
