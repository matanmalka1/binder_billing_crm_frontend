import { z } from "zod";
import { validateIsraeliIdChecksum } from "../../utils/validation";
import {
  CLIENT_ID_NUMBER_TYPES,
  CLIENT_STATUSES,
  requiresIsraeliIdChecksum,
  requiresIsraeliNumericId,
  ENTITY_TYPES,
  VAT_TYPES,
} from "./constants";

export const createBusinessSchema = z.object({
  business_name: z.string().trim().min(1, "יש להזין שם עסק").max(100, "שם עסק ארוך מדי"),
  opened_at: z.string().optional().nullable(),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

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
    accountant_name: z.string().trim().optional().nullable(),
    business_name: z.string().trim().min(1, "יש להזין שם עסק").max(100, "שם עסק ארוך מדי"),
    business_opened_at: z.string().optional().nullable(),
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

    if (requiresIsraeliIdChecksum(data.id_number_type) && !validateIsraeliIdChecksum(data.id_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id_number"],
        message: data.id_number_type === "corporation" ? "מספר ח.פ אינו תקין" : "מספר זהות אינו תקין",
      });
    }

    const nonEmployeeEntityTypes = ["osek_patur", "osek_murshe", "company_ltd"] as const;
    if (
      data.entity_type &&
      (nonEmployeeEntityTypes as readonly string[]).includes(data.entity_type) &&
      !data.vat_reporting_frequency
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vat_reporting_frequency"],
        message: 'יש לציין תדירות דיווח מע"מ עבור עוסק/חברה',
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
  entity_type: z.enum(ENTITY_TYPES).nullable().optional(),
  vat_reporting_frequency: z.enum(VAT_TYPES).nullable().optional(),
  vat_exempt_ceiling: z.string().optional().nullable(),
  advance_rate: z.string().optional().nullable(),
  accountant_name: z.string().trim().optional().nullable(),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
export type ClientEditFormValues = z.infer<typeof clientEditSchema>;
