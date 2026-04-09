import { api } from "@/api/client";
import type { TaxProfileData, TaxProfileUpdatePayload } from "./contracts";

const clientEndpoint = (clientId: number) => `/clients/${clientId}`;

export const taxProfileApi = {
  get: (clientId: number): Promise<TaxProfileData> =>
    api.get<TaxProfileData>(clientEndpoint(clientId)).then((r) => r.data),

  update: (clientId: number, data: TaxProfileUpdatePayload): Promise<TaxProfileData> =>
    api.patch<TaxProfileData>(clientEndpoint(clientId), data).then((r) => r.data),
};
