import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { TaxProfileData } from "./contracts";

export const taxProfileApi = {
  get: (businessId: number): Promise<TaxProfileData> =>
    api.get<TaxProfileData>(ENDPOINTS.businessTaxProfile(businessId)).then((r) => r.data),

  update: (businessId: number, data: Partial<TaxProfileData>): Promise<TaxProfileData> =>
    api.patch<TaxProfileData>(ENDPOINTS.businessTaxProfile(businessId), data).then((r) => r.data),
};
