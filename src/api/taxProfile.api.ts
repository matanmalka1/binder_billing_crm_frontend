import { api } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface TaxProfileData {
  vat_type: "monthly" | "bimonthly" | "exempt" | null;
  business_type: string | null;
  tax_year_start: number | null;
  accountant_name: string | null;
}

export const taxProfileApi = {
  get: (clientId: number): Promise<TaxProfileData> =>
    api.get<TaxProfileData>(ENDPOINTS.clientTaxProfile(clientId)).then((r) => r.data),

  update: (clientId: number, data: Partial<TaxProfileData>): Promise<TaxProfileData> =>
    api.patch<TaxProfileData>(ENDPOINTS.clientTaxProfile(clientId), data).then((r) => r.data),
};
