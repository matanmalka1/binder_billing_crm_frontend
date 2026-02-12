export type UserRole = "advisor" | "secretary";

export interface AuthUser {
  id: number;
  full_name: string;
  role: UserRole;
}

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
