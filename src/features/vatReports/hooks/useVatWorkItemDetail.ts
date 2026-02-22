import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";

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

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  office: "משרד",
  travel: "נסיעות",
  professional_services: "שירותים מקצועיים",
  equipment: "ציוד",
  rent: "שכירות",
  salary: "שכר עבודה",
  marketing: "שיווק",
  other: "אחר",
};

const getCategoryLabel = (category: string | null): string => {
  if (!category) return "כללי";
  return EXPENSE_CATEGORY_LABELS[category] ?? category;
};

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
      const net = Number(inv.net_amount);
      const vat = Number(inv.vat_amount);

      if (inv.invoice_type === "income") {
        const key = "הכנסות";
        const existing = outputMap.get(key);
        if (existing) {
          existing.netAmount += net;
          existing.vatAmount += vat;
        } else {
          outputMap.set(key, { label: key, netAmount: net, vatAmount: vat });
        }
      } else {
        const key = getCategoryLabel(inv.expense_category);
        const existing = inputMap.get(key);
        if (existing) {
          existing.netAmount += net;
          existing.vatAmount += vat;
        } else {
          inputMap.set(key, { label: key, netAmount: net, vatAmount: vat });
        }
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
