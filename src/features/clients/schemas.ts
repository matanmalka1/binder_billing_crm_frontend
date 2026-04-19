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
    entity_type: z.enum(ENTITY_TYPES, { message: "יש לבחור סוג ישות" }),
    phone: z.string().trim().min(1, "יש להזין מספר טלפון").regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין"),
    email: z.string().trim().min(1, "יש להזין כתובת אימייל").email("כתובת אימייל לא תקינה"),
    address_street: z.string().trim().min(1, "יש להזין רחוב"),
    address_building_number: z.string().trim().min(1, "יש להזין מספר בניין"),
    address_apartment: z.string().trim().min(1, "יש להזין מספר דירה"),
    address_city: z.string().trim().min(1, "יש להזין עיר"),
    address_zip_code: z.string().trim().min(1, "יש להזין מיקוד"),
    vat_reporting_frequency: z.enum(VAT_TYPES, { message: 'יש לציין תדירות דיווח מע"מ' }),
    vat_exempt_ceiling: z.string().optional().nullable(),
    advance_rate: z.string().trim().min(1, "יש להזין אחוז מקדמה"),
    accountant_name: z.string().trim().min(1, "יש להזין רואה חשבון מלווה"),
    business_name: z.string().trim().min(1, "יש להזין שם עסק").max(100, "שם עסק ארוך מדי"),
    business_opened_at: z.string().min(1, "יש להזין תאריך פתיחת עסק"),
  })
  .superRefine((data, ctx) => {
    if (data.entity_type === "osek_patur" && !data.vat_exempt_ceiling?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vat_exempt_ceiling"],
        message: 'יש להזין תקרת פטור מע"מ',
      });
    }

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
