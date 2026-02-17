import { z } from "zod";

export const taxProfileSchema = z.object({
  vat_type: z.enum(["monthly", "bimonthly", "exempt"]),
  business_type: z.string().trim().optional().or(z.literal("")),
  tax_year_start: z.string().trim().regex(/^\d{4}$/, "שנה לא תקינה").optional().or(z.literal("")),
  accountant_name: z.string().trim().optional().or(z.literal("")),
});

export type TaxProfileFormValues = z.infer<typeof taxProfileSchema>;

export const taxProfileDefaults: TaxProfileFormValues = {
  vat_type: "monthly",
  business_type: "",
  tax_year_start: "",
  accountant_name: "",
};
