import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import type { PaginatedResponse } from "../types/common";

export type AdvancePaymentStatus = "pending" | "paid" | "partial" | "overdue";

export interface AdvancePaymentRow {
  id: number;
  client_id: number;
  month: number;
  year: number;
  expected_amount: number | null;
  paid_amount: number | null;
  status: AdvancePaymentStatus;
  due_date: string;
  tax_deadline_id: number | null;
}

export interface ListAdvancePaymentsParams {
  client_id: number;
  year: number;
  page?: number;
  page_size?: number;
}

export interface CreateAdvancePaymentPayload {
  client_id: number;
  year: number;
  month: number;
  due_date: string;
  expected_amount?: number | null;
  paid_amount?: number | null;
  tax_deadline_id?: number | null;
}

export interface UpdateAdvancePaymentPayload {
  paid_amount?: number | null;
  status?: AdvancePaymentStatus;
}

export const advancePaymentsApi = {
  list: async (
    params: ListAdvancePaymentsParams,
  ): Promise<PaginatedResponse<AdvancePaymentRow>> => {
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      ENDPOINTS.advancePayments,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  create: async (
    payload: CreateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.post<AdvancePaymentRow>(
      ENDPOINTS.advancePayments,
      payload,
    );
    return response.data;
  },

  update: async (
    id: number,
    payload: UpdateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.patch<AdvancePaymentRow>(
      ENDPOINTS.advancePaymentById(id),
      payload,
    );
    return response.data;
  },
};