import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

export interface TaxSubmissionWidgetResponse {
  tax_year: number;
  total_clients: number;
  reports_submitted: number;
  reports_in_progress: number;
  reports_not_started: number;
  submission_percentage: number;
}

export const taxDashboardApi = {
  getTaxSubmissionsWidget: async (
    taxYear?: number
  ): Promise<TaxSubmissionWidgetResponse> => {
    const response = await api.get<TaxSubmissionWidgetResponse>(
      ENDPOINTS.dashboardTaxSubmissions,
      { params: taxYear ? { tax_year: taxYear } : undefined }
    );
    return response.data;
  },
};
