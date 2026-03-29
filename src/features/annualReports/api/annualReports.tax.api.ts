import { api } from "@/api/client";
import { ANNUAL_REPORT_ENDPOINTS } from "./endpoints";
import type { AdvancesSummary, ReadinessCheckResponse, TaxCalculationResult } from "./contracts";

export const annualReportTaxApi = {
  getTaxCalculation: async (reportId: number): Promise<TaxCalculationResult> => {
    const response = await api.get<TaxCalculationResult>(
      ANNUAL_REPORT_ENDPOINTS.annualReportTaxCalculation(reportId),
    );
    return response.data;
  },

  getAdvancesSummary: async (reportId: number): Promise<AdvancesSummary> => {
    const response = await api.get<AdvancesSummary>(
      ANNUAL_REPORT_ENDPOINTS.annualReportAdvancesSummary(reportId),
    );
    return response.data;
  },

  getReadiness: async (reportId: number): Promise<ReadinessCheckResponse> => {
    const response = await api.get<ReadinessCheckResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportReadiness(reportId),
    );
    return response.data;
  },
};
