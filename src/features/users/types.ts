export type UserRole = "advisor" | "secretary";

export interface UsersFilters {
  page: number;
  page_size: number;
  is_active: string | undefined; // "true" | "false" | undefined
  search?: string;
}

export interface AuditLogsFilters {
  page: number;
  page_size: number;
  action?: string;
  target_user_id?: number;
  actor_user_id?: number;
}
