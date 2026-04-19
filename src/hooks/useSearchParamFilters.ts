import { useSearchParams } from "react-router-dom";

export const useSearchParamFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setFilter = (key: string, value: string, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (resetPage) next.set("page", "1");
    setSearchParams(next);
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  const resetFilters = (defaults: Record<string, string> = {}) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(defaults)) {
      if (v) next.set(k, v);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  return { searchParams, setFilter, setPage, resetFilters, setSearchParams };
};
