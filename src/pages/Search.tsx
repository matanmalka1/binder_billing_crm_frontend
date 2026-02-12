import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { searchApi } from "../api/search.api";
import { getRequestErrorMessage } from "../utils/errorHandler";
import { SearchContent } from "../features/search/components/SearchContent";
import type { SearchFilters, SearchResult } from "../features/search/types";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo<SearchFilters>(
    () => ({
      query: searchParams.get("query") ?? "",
      client_name: searchParams.get("client_name") ?? "",
      id_number: searchParams.get("id_number") ?? "",
      binder_number: searchParams.get("binder_number") ?? "",
      work_state: searchParams.get("work_state") ?? "",
      sla_state: searchParams.get("sla_state") ?? "",
      signal_type: searchParams.getAll("signal_type"),
      has_signals: searchParams.get("has_signals") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchApi.search({
        query: filters.query || undefined,
        client_name: filters.client_name || undefined,
        id_number: filters.id_number || undefined,
        binder_number: filters.binder_number || undefined,
        work_state: filters.work_state || undefined,
        sla_state: filters.sla_state || undefined,
        signal_type: filters.signal_type.length > 0 ? filters.signal_type : undefined,
        has_signals:
          filters.has_signals === "true"
            ? true
            : filters.has_signals === "false"
            ? false
            : undefined,
        page: filters.page,
        page_size: filters.page_size,
      });

      setResults(response.results ?? []);
      setTotal(response.total ?? 0);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת תוצאות חיפוש"));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFilterChange = (
    name: keyof SearchFilters,
    value: string | string[],
  ) => {
    const next = new URLSearchParams(searchParams);

    if (name === "page") {
      next.set("page", String(value));
      setSearchParams(next);
      return;
    }

    if (name === "signal_type") {
      next.delete("signal_type");
      if (Array.isArray(value)) {
        value.forEach((signal) => {
          if (signal) next.append("signal_type", signal);
        });
      }
      next.set("page", "1");
      setSearchParams(next);
      return;
    }

    if (name === "page_size") {
      if (String(value)) next.set(name, String(value));
      else next.delete(name);
      next.set("page", "1");
      setSearchParams(next);
      return;
    }

    if (String(value)) {
      next.set(name, String(value));
    } else {
      next.delete(name);
    }

    next.set("page", "1");
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
