import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  CorrespondenceEntry,
  CorrespondenceListResponse,
  CreateCorrespondencePayload,
  UpdateCorrespondencePayload,
} from "./contracts";

export const correspondenceApi = {
  list: async (
    clientId: number,
    params?: { page?: number; page_size?: number },
  ): Promise<CorrespondenceListResponse> => {
    const response = await api.get<CorrespondenceListResponse>(
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
