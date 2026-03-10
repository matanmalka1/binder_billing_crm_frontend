import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  AdvancesSummary,
  ReadinessCheckResponse,
  TaxCalculationResult,
} from "./annualReports.api";

export const annualReportTaxApi = {
  getTaxCalculation: async (reportId: number): Promise<TaxCalculationResult> => {
    const res = await api.get<TaxCalculationResult>(ENDPOINTS.annualReportTaxCalculation(reportId));
    return res.data;
  },

  getAdvancesSummary: async (reportId: number): Promise<AdvancesSummary> => {
    const res = await api.get<AdvancesSummary>(ENDPOINTS.annualReportAdvancesSummary(reportId));
    return res.data;
  },

  getReadiness: async (reportId: number): Promise<ReadinessCheckResponse> => {
    const res = await api.get<ReadinessCheckResponse>(ENDPOINTS.annualReportReadiness(reportId));
    return res.data;
  },
};
