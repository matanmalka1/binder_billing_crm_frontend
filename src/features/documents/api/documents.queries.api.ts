import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  PermanentDocumentListResponse,
  DocumentVersionsResponse,
  OperationalSignalsResponse,
  ListDocumentsByClientParams,
} from "./contracts";

export const documentsQueriesApi = {
  listByClient: async (
    clientId: number,
    params?: ListDocumentsByClientParams,
  ): Promise<PermanentDocumentListResponse> => {
    const response = await api.get<PermanentDocumentListResponse>(
      ENDPOINTS.documentsByBusiness(clientId),
      params ? { params: toQueryParams(params) } : undefined,
    );
    return response.data;
  },

  getDownloadUrl: async (id: number): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(ENDPOINTS.documentDownloadUrl(id));
    return response.data;
  },

  getSignalsByClient: async (clientId: number): Promise<OperationalSignalsResponse> => {
    const response = await api.get<OperationalSignalsResponse>(
      ENDPOINTS.documentSignalsByBusiness(clientId),
    );
    return response.data;
  },

  getVersions: async (
    clientId: number,
    documentType: string,
    taxYear?: number,
  ): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      ENDPOINTS.documentVersionsByBusiness(clientId),
      {
        params: toQueryParams({
          document_type: documentType,
          ...(taxYear != null ? { tax_year: taxYear } : {}),
        }),
      },
    );
    return response.data;
  },

  listByAnnualReport: async (reportId: number): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      ENDPOINTS.documentsByAnnualReport(reportId),
    );
    return response.data;
  },
};
