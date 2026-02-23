import { api } from "./client";
import { ENDPOINTS } from "./endpoints";

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

export interface CorrespondenceListResponse {
  items: CorrespondenceEntry[];
}

export interface CreateCorrespondencePayload {
  contact_id?: number | null;
  correspondence_type: CorrespondenceEntry["correspondence_type"];
  subject: string;
  notes?: string | null;
  occurred_at: string;
}

export const correspondenceApi = {
  list: async (clientId: number): Promise<CorrespondenceListResponse> => {
    const response = await api.get<CorrespondenceListResponse>(
      ENDPOINTS.correspondenceList(clientId),
    );
    return response.data;
  },

  create: async (
    clientId: number,
    payload: CreateCorrespondencePayload,
  ): Promise<CorrespondenceEntry> => {
    const response = await api.post<CorrespondenceEntry>(
      ENDPOINTS.correspondenceCreate(clientId),
      payload,
    );
    return response.data;
  },
};
