import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { TaxSubmissionWidgetResponse } from "./contracts";

export const taxDashboardApi = {
  getTaxSubmissionsWidget: async (taxYear?: number): Promise<TaxSubmissionWidgetResponse> => {
    const response = await api.get<TaxSubmissionWidgetResponse>(
      ENDPOINTS.dashboardTaxSubmissions,
      { params: taxYear ? { tax_year: taxYear } : undefined },
    );
    return response.data;
  },
};
