export type ContactType =
  | "assessing_officer"
  | "vat_branch"
  | "national_insurance"
  | "other";

export interface AuthorityContactResponse {
  id: number;
  client_id: number;
  contact_type: ContactType;
  name: string;
  office: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AuthorityContactCreatePayload {
  contact_type: ContactType;
  name: string;
  office?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export interface AuthorityContactUpdatePayload {
  contact_type?: ContactType;
  name?: string;
  office?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}
