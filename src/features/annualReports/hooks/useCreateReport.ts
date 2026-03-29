import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { annualReportsApi, annualReportsQK, type CreateAnnualReportPayload } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { createReportSchema, type CreateReportFormValues } from "../schemas";
import { computeTaxPreview } from "../taxPreview";

type CreateReportFormOutput = z.output<typeof createReportSchema>;

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

  const [grossIncome, expenses, advancesPaid, creditPoints, taxYearStr] = useWatch({
    control: form.control,
    name: ["gross_income", "expenses", "advances_paid", "credit_points", "tax_year"],
  });

  const preview = useMemo(() => {
    const income = parseFloat(grossIncome ?? "") || 0;
    const exp = parseFloat(expenses ?? "") || 0;
    const advances = parseFloat(advancesPaid ?? "") || 0;
    const credits = parseFloat(creditPoints ?? "") || 0;
    const taxYear = parseInt(taxYearStr ?? "") || new Date().getFullYear() - 1;

    return computeTaxPreview(income, exp, advances, credits, taxYear);
  }, [grossIncome, expenses, advancesPaid, creditPoints, taxYearStr]);

  const mutation = useMutation({
    mutationFn: (payload: CreateAnnualReportPayload) => annualReportsApi.createReport(payload),
    onSuccess: (data) => {
      const message = data.profit != null
        ? `דוח נוצר | רווח ראשוני: ₪${Number(data.profit).toLocaleString("he-IL")}`
        : "דוח שנתי נוצר בהצלחה";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: annualReportsQK.all });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת דוח"),
  });

  const buildPayload = (values: CreateReportFormOutput): CreateAnnualReportPayload => ({
    business_id: Number(values.client_id),
    tax_year: Number(values.tax_year),
    client_type: values.client_type,
    deadline_type: values.deadline_type,
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

  return { form, onSubmit, isSubmitting: mutation.isPending, preview };
};
