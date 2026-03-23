import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { TaxProfileData } from "./contracts";

export const taxProfileApi = {
  get: (clientId: number): Promise<TaxProfileData> =>
    api.get<TaxProfileData>(ENDPOINTS.businessTaxProfile(clientId)).then((r) => r.data),

  update: (clientId: number, data: Partial<TaxProfileData>): Promise<TaxProfileData> =>
    api.patch<TaxProfileData>(ENDPOINTS.businessTaxProfile(clientId), data).then((r) => r.data),
};
