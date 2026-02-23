import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "שם מלא חייב להכיל לפחות 2 תווים")
    .max(100, "שם מלא ארוך מדי"),
  email: z.string().trim().email("כתובת אימייל לא תקינה"),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין")
    .optional()
    .or(z.literal("")),
  role: z.enum(["advisor", "secretary"]),
  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "שם מלא חייב להכיל לפחות 2 תווים")
    .max(100, "שם מלא ארוך מדי"),
  email: z.string().trim().email("כתובת אימייל לא תקינה"),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין")
    .optional()
    .or(z.literal("")),
  role: z.enum(["advisor", "secretary"]),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirm_password"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
