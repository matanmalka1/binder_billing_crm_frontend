import { z } from "zod";
import type { CreateVatWorkItemPayload } from "../api";

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

export const vatWorkItemCreateSchema = z.object({
  business_id: z
    .string()
    .trim()
    .min(1, "יש לבחור עסק")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, {
      message: "יש לבחור עסק תקין",
    }),
  period: z
    .string()
    .trim()
    .min(1, "יש להזין תקופה")
    .refine((v) => periodPattern.test(v), {
      message: "פורמט תקופה חייב להיות YYYY-MM",
    }),
  mark_pending: z.boolean(),
  pending_materials_note: z.string().trim().optional(),
});

export type VatWorkItemCreateFormValues = z.infer<typeof vatWorkItemCreateSchema>;

export const vatWorkItemCreateDefaultValues: VatWorkItemCreateFormValues = {
  business_id: "",
  period: "",
  mark_pending: false,
  pending_materials_note: "",
};

export const toCreateVatWorkItemPayload = (
  values: VatWorkItemCreateFormValues,
): CreateVatWorkItemPayload => ({
  business_id: Number(values.business_id),
  period: values.period.trim(),
  mark_pending: values.mark_pending,
  pending_materials_note: values.pending_materials_note?.trim() || null,
});
