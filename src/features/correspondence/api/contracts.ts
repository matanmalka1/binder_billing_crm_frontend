import type { PaginatedResponse } from "@/types";

export interface CorrespondenceEntry {
  id: number;
  client_id: number;
  contact_id: number | null;
  correspondence_type: "call" | "letter" | "email" | "meeting";
  subject: string;
  notes: string | null;
  occurred_at: string;
  created_by: number;
}

export interface CreateCorrespondencePayload {
  contact_id?: number | null;
  correspondence_type: CorrespondenceEntry["correspondence_type"];
  subject: string;
  notes?: string | null;
  occurred_at: string;
}

export interface UpdateCorrespondencePayload {
  contact_id?: number | null;
  correspondence_type?: CorrespondenceEntry["correspondence_type"];
  subject?: string;
  notes?: string | null;
  occurred_at?: string;
}

export type CorrespondenceListResponse = PaginatedResponse<CorrespondenceEntry>;
