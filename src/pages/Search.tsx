import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api } from "../api/client";
import { getRequestErrorMessage } from "../utils/errorHandler";
import { SearchContent } from "../features/search/components/SearchContent";
import type { SearchFilters, SearchResponse, SearchResult } from "../features/search/types";

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo<SearchFilters>(
    () => ({
      query: searchParams.get("query") ?? "",
      work_state: searchParams.get("work_state") ?? "",
      sla_state: searchParams.get("sla_state") ?? "",
      signal_type: searchParams.get("signal_type") ?? "",
    }),
    [searchParams],
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });
      const response = await api.get<SearchResponse>("/search", { params });
      setResults(response.data.results ?? []);
      setTotal(response.data.total ?? 0);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת תוצאות חיפוש"));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFilterChange = (name: keyof SearchFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }
    setSearchParams(next);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">חיפוש</h2>
        <p className="text-gray-600">חיפוש גלובלי על בסיס נתוני שרת בלבד</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <SearchContent
          total={total}
          filters={filters}
          results={results}
          onFilterChange={handleFilterChange}
        />
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}
    </div>
  );
};
