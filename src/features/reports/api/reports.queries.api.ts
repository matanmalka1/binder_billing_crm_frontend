import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  AgingReportResponse,
  AdvancePaymentReportResponse,
  AnnualReportStatusReportResponse,
  VatComplianceReportResponse,
} from "./contracts";

export const reportsQueriesApi = {
  getAgingReport: async (asOfDate?: string): Promise<AgingReportResponse> => {
    const params = asOfDate ? { as_of_date: asOfDate } : undefined;
    const response = await api.get<AgingReportResponse>(ENDPOINTS.reportsAging, { params });
    return response.data;
  },

  getAdvancePaymentReport: async (
    year: number,
    month?: number,
  ): Promise<AdvancePaymentReportResponse> => {
    const params: Record<string, unknown> = { year };
    if (month !== undefined) params.month = month;
    const response = await api.get<AdvancePaymentReportResponse>(
      ENDPOINTS.reportsAdvancePayments,
      { params },
    );
    return response.data;
  },

  getAnnualReportStatusReport: async (
    taxYear: number,
  ): Promise<AnnualReportStatusReportResponse> => {
    const response = await api.get<AnnualReportStatusReportResponse>(
      ENDPOINTS.reportsAnnualReportStatus,
      { params: { tax_year: taxYear } },
    );
    return response.data;
  },

  getVatComplianceReport: async (year: number): Promise<VatComplianceReportResponse> => {
    const response = await api.get<VatComplianceReportResponse>(
      ENDPOINTS.reportsVatCompliance,
      { params: { year } },
    );
    return response.data;
  },
};
