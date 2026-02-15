import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { searchApi } from "../../../api/search.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import type { SearchFilters } from "../types";

export const useSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const searchParamsForQuery = useMemo(
    () => ({
      query: filters.query || undefined,
      client_name: filters.client_name || undefined,
      id_number: filters.id_number || undefined,
      binder_number: filters.binder_number || undefined,
      work_state: filters.work_state || undefined,
      sla_state: filters.sla_state || undefined,
      signal_type: filters.signal_type.length > 0 ? filters.signal_type : undefined,
      has_signals:
        filters.has_signals === "true" ? true : filters.has_signals === "false" ? false : undefined,
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const searchQuery = useQuery({
    queryKey: ["search", "results", searchParamsForQuery] as const,
    queryFn: () => searchApi.search(searchParamsForQuery),
  });

  const handleFilterChange = (name: keyof SearchFilters, value: string | string[]) => {
    const next = new URLSearchParams(searchParams);
    if (name === "page") next.set("page", String(value));
    else if (name === "signal_type") {
      next.delete("signal_type");
      if (Array.isArray(value)) value.forEach((signal) => signal && next.append("signal_type", signal));
      next.set("page", "1");
    } else {
      if (String(value)) next.set(name, String(value));
      else next.delete(name);
      next.set("page", "1");
    }
    setSearchParams(next);
  };

  return {
    error: searchQuery.error
      ? getErrorMessage(searchQuery.error, "שגיאה בטעינת תוצאות חיפוש")
      : null,
    filters,
    handleFilterChange,
    loading: searchQuery.isPending,
    results: searchQuery.data?.results ?? [],
    total: searchQuery.data?.total ?? 0,
  };
};
