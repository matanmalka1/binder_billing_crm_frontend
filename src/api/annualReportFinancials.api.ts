import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  ExpenseLinePayload,
  ExpenseLineResponse,
  FinancialSummaryResponse,
  IncomeLinePayload,
  IncomeLineResponse,
} from "./annualReports.api";

export const annualReportFinancialsApi = {
  getFinancials: async (reportId: number): Promise<FinancialSummaryResponse> => {
    const res = await api.get<FinancialSummaryResponse>(ENDPOINTS.annualReportFinancials(reportId));
    return res.data;
  },

  addIncomeLine: async (reportId: number, payload: IncomeLinePayload): Promise<IncomeLineResponse> => {
    const res = await api.post<IncomeLineResponse>(ENDPOINTS.annualReportIncome(reportId), payload);
    return res.data;
  },

  updateIncomeLine: async (
    reportId: number,
    lineId: number,
    payload: Partial<IncomeLinePayload>
  ): Promise<IncomeLineResponse> => {
    const res = await api.patch<IncomeLineResponse>(
      ENDPOINTS.annualReportIncomeById(reportId, lineId),
      payload,
    );
    return res.data;
  },

  deleteIncomeLine: async (reportId: number, lineId: number): Promise<void> => {
    await api.delete(ENDPOINTS.annualReportIncomeById(reportId, lineId));
  },

  addExpenseLine: async (reportId: number, payload: ExpenseLinePayload): Promise<ExpenseLineResponse> => {
    const res = await api.post<ExpenseLineResponse>(ENDPOINTS.annualReportExpenses(reportId), payload);
    return res.data;
  },

  updateExpenseLine: async (
    reportId: number,
    lineId: number,
    payload: Partial<ExpenseLinePayload>
  ): Promise<ExpenseLineResponse> => {
    const res = await api.patch<ExpenseLineResponse>(
      ENDPOINTS.annualReportExpenseById(reportId, lineId),
      payload,
    );
    return res.data;
  },

  deleteExpenseLine: async (reportId: number, lineId: number): Promise<void> => {
    await api.delete(ENDPOINTS.annualReportExpenseById(reportId, lineId));
  },
};
