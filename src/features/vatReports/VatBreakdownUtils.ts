import type { VatInvoiceResponse } from "../../api/vatReports.api";
import { DEDUCTION_RATES, CATEGORY_TABLE_LABELS } from "./constants";

export interface ExpenseCategoryRow {
  categoryKey: string;
  label: string;
  deductionRate: number;
  netAmount: number;
  grossVat: number;      // raw VAT before deduction (shown as "מע"מ בחשבוניות")
  deductibleVat: number; // stored vat_amount — the deductible portion
}

export interface VatBreakdownData {
  totalIncomeNet: number;
  totalOutputVat: number;   // authoritative from workItem
  expenseRows: ExpenseCategoryRow[];
  totalExpenseNet: number;
  totalGrossVat: number;    // sum of grossVat — "מע"מ בחשבוניות"
  totalInputVat: number;    // authoritative from workItem
}

export function computeVatBreakdown(
  invoices: VatInvoiceResponse[],
  totalOutputVat: number,
  totalInputVat: number,
): VatBreakdownData {
  const income = invoices.filter((i) => i.invoice_type === "income");
  const expense = invoices.filter((i) => i.invoice_type === "expense");

  const totalIncomeNet = income.reduce((s, i) => s + Number(i.net_amount), 0);

  // Group expenses by category
  const grouped: Record<string, { net: number; deductible: number }> = {};
  for (const inv of expense) {
    const key = inv.expense_category ?? "other";
    if (!grouped[key]) grouped[key] = { net: 0, deductible: 0 };
    grouped[key].net += Number(inv.net_amount);
    grouped[key].deductible += Number(inv.vat_amount);
  }

  const expenseRows: ExpenseCategoryRow[] = Object.entries(grouped).map(([key, val]) => {
    const rate = DEDUCTION_RATES[key] ?? 0;
    const grossVat = rate > 0 ? val.deductible / rate : val.deductible;
    return {
      categoryKey: key,
      label: CATEGORY_TABLE_LABELS[key] ?? key,
      deductionRate: rate,
      netAmount: val.net,
      grossVat,
      deductibleVat: val.deductible,
    };
  });

  const totalExpenseNet = expenseRows.reduce((s, r) => s + r.netAmount, 0);
  const totalGrossVat = expenseRows.reduce((s, r) => s + r.grossVat, 0);

  return {
    totalIncomeNet,
    totalOutputVat,
    expenseRows,
    totalExpenseNet,
    totalGrossVat,
    totalInputVat,
  };
}
