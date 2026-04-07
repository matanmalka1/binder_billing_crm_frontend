import { z } from "zod";
import { validateIsraeliIdChecksum } from "../../utils/validation";
import {
  BUSINESS_TYPES,
  CLIENT_ID_NUMBER_TYPES,
  CLIENT_STATUSES,
  VAT_TYPES,
  type ClientIdNumberType,
} from "./constants";

export const createBusinessSchema = z.object({
  business_type: z.enum(BUSINESS_TYPES),
  opened_at: z.string().min(1, "יש לבחור תאריך פתיחה"),
  business_name: z.string().trim().min(1, "יש להזין שם עסק").max(100, "שם עסק ארוך מדי"),
  tax_id_number: z
    .string()
    .trim()
    .regex(/^\d+$/, "מספר עוסק/ח.פ חייב להכיל ספרות בלבד")
    .length(9, "מספר עוסק/ח.פ חייב להכיל בדיוק 9 ספרות"),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

const requiresIsraeliNumericId = (idNumberType: ClientIdNumberType): boolean =>
  idNumberType === "individual" || idNumberType === "corporation";

export const createClientSchema = z
  .object({
    id_number_type: z.enum(CLIENT_ID_NUMBER_TYPES),
    full_name: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם מלא ארוך מדי"),
    id_number: z.string().trim().min(1, "יש להזין מספר מזהה"),
    phone: z.string().trim().min(1, "יש להזין מספר טלפון").regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין"),
    email: z.string().trim().min(1, "יש להזין כתובת אימייל").email("כתובת אימייל לא תקינה"),
    address_street: z.string().trim().optional().or(z.literal("")),
    address_building_number: z.string().trim().optional().or(z.literal("")),
    address_city: z.string().trim().optional().or(z.literal("")),
    vat_reporting_frequency: z.enum(VAT_TYPES).nullable().optional(),
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
  vat_reporting_frequency: z.enum(VAT_TYPES).nullable().optional(),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
export type ClientEditFormValues = z.infer<typeof clientEditSchema>;
