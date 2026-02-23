export type UserRole = "advisor" | "secretary";

export interface UsersFilters {
  page: number;
  page_size: number;
}

export interface AuditLogsFilters {
  page: number;
  page_size: number;
  action?: string;
  target_user_id?: number;
  actor_user_id?: number;
}
