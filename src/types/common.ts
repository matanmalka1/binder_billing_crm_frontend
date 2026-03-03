export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

// Pagination params for API requests (snake_case to match backend)
export interface PagedQueryParams {
  page: number;
  page_size: number;
}
