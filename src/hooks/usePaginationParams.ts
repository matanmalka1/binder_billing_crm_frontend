import { useSearchParams } from "react-router-dom";
import { parsePositiveInt } from "../utils/utils";

interface PaginationDefaults {
  page?: number;
  pageSize?: number;
}

export const usePaginationParams = (
  defaults: PaginationDefaults = { page: 1, pageSize: 20 },
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePositiveInt(searchParams.get("page"), defaults.page ?? 1);
  const pageSize = parsePositiveInt(
    searchParams.get("page_size"),
    defaults.pageSize ?? 20,
  );

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const setPageSize = (nextPageSize: number | string) => {
    const next = new URLSearchParams(searchParams);
    next.set("page_size", String(nextPageSize));
    next.set("page", "1");
    setSearchParams(next);
  };

  return { page, page_size: pageSize, searchParams, setSearchParams, setPage, setPageSize };
};
