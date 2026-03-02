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

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface BackendErrorBody {
  type?: string;
  detail?: string;
  status_code?: number;
}

export interface BackendErrorEnvelope {
  detail?: unknown;
  message?: string;
  error?: BackendErrorBody | string;
}
