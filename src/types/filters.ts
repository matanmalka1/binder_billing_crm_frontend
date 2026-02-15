import type { PagedQueryParams } from "./common";

export type PagedFilters<T extends Record<string, unknown> = Record<string, unknown>> =
  PagedQueryParams & T;
