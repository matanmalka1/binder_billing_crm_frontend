import { api } from "@/api/client";
import { ANNUAL_REPORT_ENDPOINTS } from "./endpoints";
import type {
  ExpenseLinePayload,
  ExpenseLineResponse,
  FinancialSummaryResponse,
  IncomeLinePayload,
  IncomeLineResponse,
  VatAutoPopulateResponse,
} from "./contracts";

export const annualReportFinancialsApi = {
  getFinancials: async (reportId: number): Promise<FinancialSummaryResponse> => {
    const response = await api.get<FinancialSummaryResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportFinancials(reportId),
    );
    return response.data;
  },

  addIncomeLine: async (reportId: number, payload: IncomeLinePayload): Promise<IncomeLineResponse> => {
    const response = await api.post<IncomeLineResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportIncome(reportId),
      payload,
    );
    return response.data;
  },

  updateIncomeLine: async (
    reportId: number,
    lineId: number,
    payload: Partial<IncomeLinePayload>,
  ): Promise<IncomeLineResponse> => {
    const response = await api.patch<IncomeLineResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportIncomeById(reportId, lineId),
      payload,
    );
    return response.data;
  },

  deleteIncomeLine: async (reportId: number, lineId: number): Promise<void> => {
    await api.delete(ANNUAL_REPORT_ENDPOINTS.annualReportIncomeById(reportId, lineId));
  },

  addExpenseLine: async (reportId: number, payload: ExpenseLinePayload): Promise<ExpenseLineResponse> => {
    const response = await api.post<ExpenseLineResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportExpenses(reportId),
      payload,
    );
    return response.data;
  },

  updateExpenseLine: async (
    reportId: number,
    lineId: number,
    payload: Partial<ExpenseLinePayload>,
  ): Promise<ExpenseLineResponse> => {
    const response = await api.patch<ExpenseLineResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportExpenseById(reportId, lineId),
      payload,
    );
    return response.data;
  },

  deleteExpenseLine: async (reportId: number, lineId: number): Promise<void> => {
    await api.delete(ANNUAL_REPORT_ENDPOINTS.annualReportExpenseById(reportId, lineId));
  },

  autoPopulate: async (reportId: number, force = false): Promise<VatAutoPopulateResponse> => {
    const response = await api.post<VatAutoPopulateResponse>(
      `${ANNUAL_REPORT_ENDPOINTS.annualReportAutoPopulate(reportId)}?force=${force}`,
    );
    return response.data;
  },
};
