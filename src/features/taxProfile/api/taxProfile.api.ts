import { api } from "@/api/client";
import { BUSINESS_ENDPOINTS } from "@/features/businesses";
import type { TaxProfileData } from "./contracts";

export const taxProfileApi = {
  get: (businessId: number): Promise<TaxProfileData> =>
    api.get<TaxProfileData>(BUSINESS_ENDPOINTS.businessTaxProfile(businessId)).then((r) => r.data),

  update: (businessId: number, data: Partial<TaxProfileData>): Promise<TaxProfileData> =>
    api.patch<TaxProfileData>(BUSINESS_ENDPOINTS.businessTaxProfile(businessId), data).then((r) => r.data),
};
