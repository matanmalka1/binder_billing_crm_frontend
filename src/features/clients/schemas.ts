import { z } from "zod";

export const createClientSchema = z.object({
  full_name: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם מלא ארוך מדי"),
  id_number: z.string().trim().min(8, "מספר זהות/ח.פ חייב להכיל לפחות 8 תווים").max(9, "מספר זהות/ח.פ ארוך מדי").regex(/^\d+$/, "מספר זהות/ח.פ חייב להכיל ספרות בלבד"),
  client_type: z.enum(["osek_patur", "osek_murshe", "company", "employee"]),
  phone: z.string().trim().regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין").optional().or(z.literal("")),
  email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  opened_at: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לא תקין (פורמט: YYYY-MM-DD)"),
});

export const clientEditSchema = z.object({
  full_name: z.string().trim().min(1, "יש להזין שם מלא"),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  status: z.enum(["active", "frozen", "closed"]),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
export type ClientEditFormValues = z.infer<typeof clientEditSchema>;
