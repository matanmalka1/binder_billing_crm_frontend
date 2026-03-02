export type UserRole = "advisor" | "secretary";

export interface AuthUser {
  id: number;
  full_name: string;
  role: UserRole;
}