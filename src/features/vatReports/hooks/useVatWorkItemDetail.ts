import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";
import { CATEGORY_LABELS } from "../constants";

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

const getCategoryLabel = (category: string | null): string =>
  CATEGORY_LABELS[category ?? ""] ?? category ?? "כללי";

export const useVatWorkItemDetail = (workItemId: number | null) => {
  const invoicesQuery = useQuery({
    queryKey: QK.tax.vatWorkItems.invoices(workItemId ?? 0),
    queryFn: () => vatReportsApi.listInvoices(workItemId!),
    enabled: workItemId !== null,
  });

  const summary = useMemo<VatWorkItemSummary>(() => {
    const items = invoicesQuery.data?.items ?? [];

    const outputMap = new Map<string, VatCategorySummaryRow>();
    const inputMap = new Map<string, VatCategorySummaryRow>();

    for (const inv of items) {
      const map = inv.invoice_type === "income" ? outputMap : inputMap;
      const key =
        inv.invoice_type === "income" ? "הכנסות" : getCategoryLabel(inv.expense_category);
      const existing = map.get(key);
      if (existing) {
        existing.netAmount += inv.net_amount;
        existing.vatAmount += inv.vat_amount;
      } else {
        map.set(key, { label: key, netAmount: inv.net_amount, vatAmount: inv.vat_amount });
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
  }, [invoicesQuery.data]);

  return {
    summary,
    loading: invoicesQuery.isPending && workItemId !== null,
    error: invoicesQuery.isError,
  };
};