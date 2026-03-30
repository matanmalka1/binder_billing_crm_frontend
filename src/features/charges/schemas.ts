import { z } from "zod";
import type { CreateChargePayload } from "./api";

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const chargeTypeValues = [
  "monthly_retainer",
  "annual_report_fee",
  "vat_filing_fee",
  "representation_fee",
  "consultation_fee",
  "other",
] as const;

export const chargeCreateSchema = z.object({
  business_id: z
    .string()
    .trim()
    .min(1, "יש להזין מזהה עסק")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "יש להזין מזהה עסק חיובי",
    }),
  amount: z
    .string()
    .trim()
    .min(1, "יש להזין סכום")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: "יש להזין סכום חיובי",
    }),
  charge_type: z.enum(chargeTypeValues),
  months_covered: z.union([z.literal(1), z.literal(2)]),
  period: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || periodPattern.test(value), {
      message: "פורמט תקופה חייב להיות YYYY-MM",
    }),
});

export type ChargeCreateFormValues = z.infer<typeof chargeCreateSchema>;

export const chargeCreateDefaultValues: ChargeCreateFormValues = {
  business_id: "",
  amount: "",
  charge_type: "monthly_retainer",
  months_covered: 1,
  period: "",
};

export const toCreateChargePayload = (
  values: ChargeCreateFormValues,
): CreateChargePayload => ({
  business_id: Number(values.business_id),
  amount: values.amount,
  charge_type: values.charge_type,
  months_covered: values.months_covered,
  period: values.period?.trim() ? values.period.trim() : null,
});
