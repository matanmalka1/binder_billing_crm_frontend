import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi, type VatInvoiceResponse } from "../api";
import { vatReportsQK } from "../api/queryKeys";
import { getVatCategoryLabel } from "../utils";

export interface VatCategorySummaryRow {
  label: string;
  netAmount: number;
  vatAmount: number;
}

export interface VatWorkItemSummary {
  outputRows: VatCategorySummaryRow[];
  inputRows: VatCategorySummaryRow[];
  totalOutputNet: number;
  totalOutputVat: number;
  totalInputNet: number;
  totalInputVat: number;
}

const buildVatWorkItemSummary = (
  items: VatInvoiceResponse[],
): VatWorkItemSummary => {
  const outputMap = new Map<string, VatCategorySummaryRow>();
  const inputMap = new Map<string, VatCategorySummaryRow>();

  for (const inv of items) {
    const map = inv.invoice_type === "income" ? outputMap : inputMap;
    const key =
      inv.invoice_type === "income" ? "הכנסות" : getVatCategoryLabel(inv.expense_category);
    const existing = map.get(key);
    const netAmount = Number(inv.net_amount);
    const vatAmount = Number(inv.vat_amount);
    if (existing) {
      existing.netAmount += netAmount;
      existing.vatAmount += vatAmount;
    } else {
      map.set(key, { label: key, netAmount, vatAmount });
    }
  }

  const outputRows = Array.from(outputMap.values());
  const inputRows = Array.from(inputMap.values());

  return {
    outputRows,
    inputRows,
    totalOutputNet: outputRows.reduce((s, r) => s + r.netAmount, 0),
    totalOutputVat: outputRows.reduce((s, r) => s + r.vatAmount, 0),
    totalInputNet: inputRows.reduce((s, r) => s + r.netAmount, 0),
    totalInputVat: inputRows.reduce((s, r) => s + r.vatAmount, 0),
  };
};

export const useVatWorkItemDetail = (
  workItemId: number | null,
  loadedInvoices?: VatInvoiceResponse[],
) => {
  const validWorkItemId =
    typeof workItemId === "number" && Number.isInteger(workItemId) && workItemId > 0
      ? workItemId
      : null;
  const shouldFetchInvoices = loadedInvoices === undefined;

  const invoicesQuery = useQuery({
    queryKey: vatReportsQK.invoices(validWorkItemId ?? 0),
    queryFn: () => vatReportsApi.listInvoices(validWorkItemId ?? 0),
    enabled: shouldFetchInvoices && validWorkItemId !== null,
  });

  const summary = useMemo<VatWorkItemSummary>(() => {
    return buildVatWorkItemSummary(loadedInvoices ?? invoicesQuery.data?.items ?? []);
  }, [invoicesQuery.data?.items, loadedInvoices]);

  return {
    summary,
    loading: shouldFetchInvoices && invoicesQuery.isPending && validWorkItemId !== null,
    error: invoicesQuery.isError
      ? (invoicesQuery.error?.message ?? "שגיאה בטעינת חשבוניות")
      : null,
  };
};
