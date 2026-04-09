import { z } from "zod";

export const taxProfileSchema = z.object({
  vat_reporting_frequency: z.enum(["monthly", "bimonthly", "exempt"]),
  business_type_label: z.string().trim().optional().or(z.literal("")),
  tax_year_start: z.string().trim().optional().or(z.literal("")).refine(
    (v) => !v || (/^\d{4}$/.test(v) && Number(v) >= 1900 && Number(v) <= 2100),
    "שנה לא תקינה",
  ),
  accountant_name: z.string().trim().optional().or(z.literal("")),
  advance_rate: z.string().trim().optional().or(z.literal("")),
});

export type TaxProfileFormValues = z.infer<typeof taxProfileSchema>;

export const taxProfileDefaults: TaxProfileFormValues = {
  vat_reporting_frequency: "monthly",
  business_type_label: "",
  tax_year_start: "",
  accountant_name: "",
  advance_rate: "",
};
