import { z } from "zod";
import type { CreateVatWorkItemPayload } from "../../api/vatReports.api";

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

export const vatWorkItemCreateSchema = z.object({
  client_id: z
    .string()
    .trim()
    .min(1, "יש להזין מזהה לקוח")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "יש להזין מזהה לקוח חיובי",
    }),
  period: z
    .string()
    .trim()
    .min(1, "יש להזין תקופה")
    .refine((value) => periodPattern.test(value), {
      message: "פורמט תקופה חייב להיות YYYY-MM",
    }),
  mark_pending: z.boolean(),
  pending_materials_note: z.string().trim().optional(),
});

export type VatWorkItemCreateFormValues = z.infer<typeof vatWorkItemCreateSchema>;

export const vatWorkItemCreateDefaultValues: VatWorkItemCreateFormValues = {
  client_id: "",
  period: "",
  mark_pending: false,
  pending_materials_note: "",
};

export const toCreateVatWorkItemPayload = (
  values: VatWorkItemCreateFormValues,
): CreateVatWorkItemPayload => ({
  client_id: Number(values.client_id),
  period: values.period.trim(),
  mark_pending: values.mark_pending,
  pending_materials_note: values.pending_materials_note?.trim() || null,
});
