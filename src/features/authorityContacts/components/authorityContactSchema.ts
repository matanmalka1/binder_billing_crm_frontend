import { z } from "zod";

export const authorityContactSchema = z.object({
  contact_type: z.enum(["assessing_officer", "vat_branch", "national_insurance", "other"]),
  name: z.string().trim().min(1, "יש להזין שם"),
  office: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type AuthorityContactFormValues = z.infer<typeof authorityContactSchema>;

export const authorityContactDefaults: AuthorityContactFormValues = {
  contact_type: "assessing_officer",
  name: "",
  office: "",
  phone: "",
  email: "",
  notes: "",
};
