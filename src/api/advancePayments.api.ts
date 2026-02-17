import { api } from "./client";
import { toQueryParams } from "./queryParams";
import type { PaginatedResponse } from "../types/common";

export interface AdvancePaymentRow {
  id: number;
  client_id: number;
  month: number;
  year: number;
  expected_amount: number | null;
  paid_amount: number | null;
  status: "pending" | "paid" | "partial" | "overdue";
  due_date: string;
  tax_deadline_id: number | null;
}

export const advancePaymentsApi = {
  list: async (params: {
    client_id: number;
    year: number;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<AdvancePaymentRow>> => {
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      "/advance-payments",
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  update: async (
    id: number,
    payload: { paid_amount?: number | null; status?: string },
  ): Promise<AdvancePaymentRow> => {
    const response = await api.patch<AdvancePaymentRow>(
      `/advance-payments/${id}`,
      payload,
    );
    return response.data;
  },
};
