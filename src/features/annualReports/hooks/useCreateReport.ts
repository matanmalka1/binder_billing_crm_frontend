import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { annualReportsApi, type CreateAnnualReportPayload } from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { createReportSchema } from "../schemas";

export type CreateReportFormValues = z.input<typeof createReportSchema>;
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
      notes: "",
      has_rental_income: false,
      has_capital_gains: false,
      has_foreign_income: false,
      has_depreciation: false,
      has_exempt_rental: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateAnnualReportPayload) => annualReportsApi.createReport(payload),
    onSuccess: () => {
      toast.success("דוח שנתי נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת דוח"),
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      client_id: Number(values.client_id),
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
  });

  return { form, onSubmit, isSubmitting: mutation.isPending };
};
