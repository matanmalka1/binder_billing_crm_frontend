import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePaginationParams } from "./usePaginationParams";
import type { QueryKey } from "@tanstack/react-query";

interface Options<F, P, R> {
  parseFilters: (searchParams: URLSearchParams, page: number, pageSize: number) => F;
  buildParams: (filters: F) => P;
  queryKey: (params: P) => QueryKey;
  queryFn: (params: P) => Promise<R>;
  defaultPage?: number;
  defaultPageSize?: number;
}

export const usePaginatedResource = <F, P, R extends { items?: unknown[]; total?: number }>(
  options: Options<F, P, R>,
) => {
  const {
    parseFilters,
    buildParams,
    queryKey,
    queryFn,
    defaultPage = 1,
    defaultPageSize = 20,
  } = options;

  const { searchParams, setSearchParams, page, page_size, setPage } = usePaginationParams({
    page: defaultPage,
    pageSize: defaultPageSize,
  });

  const filters = useMemo(() => parseFilters(searchParams, page, page_size), [parseFilters, searchParams, page, page_size]);
  const params = useMemo(() => buildParams(filters), [buildParams, filters]);

  const query = useQuery({ queryKey: queryKey(params), queryFn: () => queryFn(params) });

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  return {
    data: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    error: query.error,
    loading: query.isPending,
    filters,
    params,
    searchParams,
    setSearchParams,
    setFilter,
    setPage,
  } as const;
};
