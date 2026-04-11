import { z } from "zod";
import { validateIsraeliIdChecksum } from "../../utils/validation";
import {
  BUSINESS_TYPES,
  CLIENT_ID_NUMBER_TYPES,
  CLIENT_STATUSES,
  ENTITY_TYPES,
  VAT_TYPES,
  type ClientIdNumberType,
} from "./constants";

export const createBusinessSchema = z.object({
  business_name: z.string().trim().min(1, "יש להזין שם עסק").max(100, "שם עסק ארוך מדי"),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

const requiresIsraeliNumericId = (idNumberType: ClientIdNumberType): boolean =>
  idNumberType === "individual" || idNumberType === "corporation";

export const createClientSchema = z
  .object({
    id_number_type: z.enum(CLIENT_ID_NUMBER_TYPES),
    full_name: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם מלא ארוך מדי"),
    id_number: z.string().trim().min(1, "יש להזין מספר מזהה"),
    entity_type: z.enum(ENTITY_TYPES).nullable().optional(),
    phone: z.string().trim().min(1, "יש להזין מספר טלפון").regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין"),
    email: z.string().trim().min(1, "יש להזין כתובת אימייל").email("כתובת אימייל לא תקינה"),
    address_street: z.string().trim().optional().or(z.literal("")),
    address_building_number: z.string().trim().optional().or(z.literal("")),
    address_apartment: z.string().trim().optional().or(z.literal("")),
    address_city: z.string().trim().optional().or(z.literal("")),
    address_zip_code: z.string().trim().optional().or(z.literal("")),
    vat_reporting_frequency: z.enum(VAT_TYPES).nullable().optional(),
    vat_exempt_ceiling: z.string().optional().nullable(),
    advance_rate: z.string().optional().nullable(),
    business_start_date: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!requiresIsraeliNumericId(data.id_number_type)) {
      return;
    }

    if (!/^\d+$/.test(data.id_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_number"],
        message: "מספר זהות/ח.פ חייב להכיל ספרות בלבד",
      });
      return;
    }

    if (data.id_number.length !== 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_number"],
        message: "מספר זהות/ח.פ חייב להכיל בדיוק 9 ספרות",
      });
      return;
    }

    if (data.id_number_type === "individual" && !validateIsraeliIdChecksum(data.id_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_number"],
        message: "מספר זהות אינו תקין",
      });
    }
  });

export const clientEditSchema = z.object({
  full_name: z.string().trim().min(1, "יש להזין שם מלא"),
  status: z.enum(CLIENT_STATUSES),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  // Structured address fields
  address_street: z.string().trim().optional().or(z.literal("")),
  address_building_number: z.string().trim().optional().or(z.literal("")),
  address_apartment: z.string().trim().optional().or(z.literal("")),
  address_city: z.string().trim().optional().or(z.literal("")),
  address_zip_code: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  entity_type: z.enum(ENTITY_TYPES).nullable().optional(),
  vat_reporting_frequency: z.enum(VAT_TYPES).nullable().optional(),
  vat_start_date: z.string().optional().nullable(),
  vat_exempt_ceiling: z.string().optional().nullable(),
  advance_rate: z.string().optional().nullable(),
  advance_rate_updated_at: z.string().optional().nullable(),
  accountant_name: z.string().trim().optional().nullable(),
  business_type_label: z.string().trim().optional().nullable(),
  business_start_date: z.string().optional().nullable(),
  fiscal_year_start_month: z.number().int().min(1).max(12).optional().nullable(),
  tax_year_start: z.number().int().min(1900).max(2100).optional().nullable(),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
export type ClientEditFormValues = z.infer<typeof clientEditSchema>;
