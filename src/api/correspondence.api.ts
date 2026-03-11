import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { PaginatedResponse } from "../types/common";

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

export const correspondenceApi = {
  list: async (
    clientId: number,
    params?: { page?: number; page_size?: number },
  ): Promise<PaginatedResponse<CorrespondenceEntry>> => {
    const response = await api.get<PaginatedResponse<CorrespondenceEntry>>(
      ENDPOINTS.correspondenceList(clientId),
      { params },
    );
    return response.data;
  },

  create: async (
    clientId: number,
    payload: CreateCorrespondencePayload,
  ): Promise<CorrespondenceEntry> => {
    const response = await api.post<CorrespondenceEntry>(
      ENDPOINTS.correspondenceList(clientId),
      payload,
    );
    return response.data;
  },

  update: async (
    clientId: number,
    id: number,
    payload: UpdateCorrespondencePayload,
  ): Promise<CorrespondenceEntry> => {
    const response = await api.patch<CorrespondenceEntry>(
      ENDPOINTS.correspondenceById(clientId, id),
      payload,
    );
    return response.data;
  },

  delete: async (clientId: number, id: number): Promise<void> => {
    await api.delete(ENDPOINTS.correspondenceById(clientId, id));
  },
};
