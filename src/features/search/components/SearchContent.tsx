import React from "react";
import { Card } from "../../../components/ui/Card";
import type { SearchFilters, SearchResult } from "../types";
import { SearchFiltersBar } from "./SearchFiltersBar";
import { SearchTable } from "./SearchTable";

interface SearchContentProps {
  total: number;
  filters: SearchFilters;
  results: SearchResult[];
  onFilterChange: (
    name: keyof SearchFilters,
    value: string | string[],
  ) => void;
}

export const SearchContent: React.FC<SearchContentProps> = ({
  total,
  filters,
  results,
  onFilterChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

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

        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-gray-600">
            עמוד {filters.page} מתוך {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
              onClick={() => onFilterChange("page", String(filters.page - 1))}
              disabled={filters.page <= 1}
            >
              הקודם
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
              onClick={() => onFilterChange("page", String(filters.page + 1))}
              disabled={filters.page >= totalPages}
            >
              הבא
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
