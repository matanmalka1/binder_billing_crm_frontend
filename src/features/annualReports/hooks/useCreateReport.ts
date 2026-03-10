import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { annualReportsApi, type CreateAnnualReportPayload } from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { createReportSchema, type CreateReportFormValues } from "../schemas";

type CreateReportFormOutput = z.output<typeof createReportSchema>;

// Israeli income tax brackets (2024) — marginal rates
const TAX_BRACKETS = [
  { limit: 81_480, rate: 0.1 },
  { limit: 116_760, rate: 0.14 },
  { limit: 187_800, rate: 0.2 },
  { limit: 261_360, rate: 0.31 },
  { limit: 542_160, rate: 0.35 },
  { limit: 698_280, rate: 0.47 },
  { limit: Infinity, rate: 0.5 },
];

const CREDIT_POINT_VALUE = 2_904; // ILS per credit point (2024)

function computeTax(taxableIncome: number): number {
  let tax = 0;
  let prev = 0;
  for (const { limit, rate } of TAX_BRACKETS) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  return Math.max(0, tax);
}

export const useCreateReport = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateReportFormValues, undefined, CreateReportFormOutput>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      client_id: "",
      tax_year: String(new Date().getFullYear() - 1),
      client_type: "individual",
      deadline_type: "standard",
      filing_date: "",
      notes: "",
      has_rental_income: false,
      has_capital_gains: false,
      has_foreign_income: false,
      has_depreciation: false,
      has_exempt_rental: false,
      gross_income: "",
      expenses: "",
      advances_paid: "",
      credit_points: "",
    },
  });

  const [grossIncome, expenses, advancesPaid, creditPoints] = useWatch({
    control: form.control,
    name: ["gross_income", "expenses", "advances_paid", "credit_points"],
  });

  const preview = useMemo(() => {
    const income = parseFloat(grossIncome ?? "") || 0;
    const exp = parseFloat(expenses ?? "") || 0;
    const advances = parseFloat(advancesPaid ?? "") || 0;
    const credits = parseFloat(creditPoints ?? "") || 0;

    const netProfit = income - exp;
    const grossTax = computeTax(Math.max(0, netProfit));
    const creditReduction = credits * CREDIT_POINT_VALUE;
    const estimatedTax = Math.max(0, grossTax - creditReduction);
    const balance = estimatedTax - advances;

    return { netProfit, estimatedTax, balance };
  }, [grossIncome, expenses, advancesPaid, creditPoints]);

  const mutation = useMutation({
    mutationFn: (payload: CreateAnnualReportPayload) => annualReportsApi.createReport(payload),
    onSuccess: (data) => {
      const message = data.profit != null
        ? `דוח נוצר | רווח ראשוני: ₪${data.profit.toLocaleString("he-IL")}`
        : "דוח שנתי נוצר בהצלחה";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת דוח"),
  });

  const buildPayload = (values: CreateReportFormOutput): CreateAnnualReportPayload => ({
    client_id: Number(values.client_id),
    tax_year: Number(values.tax_year),
    client_type: values.client_type,
    deadline_type: values.deadline_type,
    filing_date: values.filing_date || null,
    notes: values.notes || null,
    has_rental_income: values.has_rental_income,
    has_capital_gains: values.has_capital_gains,
    has_foreign_income: values.has_foreign_income,
    has_depreciation: values.has_depreciation,
    has_exempt_rental: values.has_exempt_rental,
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(buildPayload(values));
  });

  const onSaveDraft = form.handleSubmit((values) => {
    mutation.mutate({ ...buildPayload(values), status: "draft" });
  });

  return { form, onSubmit, onSaveDraft, isSubmitting: mutation.isPending, preview };
};
