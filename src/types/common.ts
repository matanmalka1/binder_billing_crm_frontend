export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
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

export type UserRole = "advisor" | "secretary";

export interface AuthUser {
  id: number;
  full_name: string;
  role: UserRole;
}
