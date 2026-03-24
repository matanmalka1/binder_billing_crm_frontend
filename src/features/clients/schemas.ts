import { z } from "zod";
import { validateIsraeliIdChecksum } from "../../utils/validation";
import type { BusinessType } from "./api/contracts";

const BUSINESS_TYPES: [BusinessType, ...BusinessType[]] = ["osek_patur", "osek_murshe", "company", "employee"];

export const createBusinessSchema = z.object({
  business_type: z.enum(BUSINESS_TYPES),
  opened_at: z.string().min(1, "יש לבחור תאריך פתיחה"),
  business_name: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

const idNumberField = z
  .string()
  .trim()
  .regex(/^\d+$/, "מספר זהות/ח.פ חייב להכיל ספרות בלבד")
  .length(9, "מספר זהות/ח.פ חייב להכיל בדיוק 9 ספרות");

export const createClientSchema = z
  .object({
    full_name: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם מלא ארוך מדי"),
    id_number: idNumberField,
    id_number_type: z.enum(["individual", "corporation", "passport", "other"]),
    phone: z.string().trim().regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין").optional().or(z.literal("")),
    email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // חברה — ח.פ משתמש באותו אלגוריתם, אפשר להפעיל על הכל
    if (!validateIsraeliIdChecksum(data.id_number)) {
      ctx.addIssue({
      code: "custom",
      message: "מספר זהות/ח.פ אינו תקין",
      path: ["id_number"],
      });
    }
  });

export const clientEditSchema = z.object({
  full_name: z.string().trim().min(1, "יש להזין שם מלא"),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  // Structured address fields
  address_street: z.string().trim().optional().or(z.literal("")),
  address_building_number: z.string().trim().optional().or(z.literal("")),
  address_apartment: z.string().trim().optional().or(z.literal("")),
  address_city: z.string().trim().optional().or(z.literal("")),
  address_zip_code: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
export type ClientEditFormValues = z.infer<typeof clientEditSchema>;
