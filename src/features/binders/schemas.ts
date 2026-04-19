import { z } from "zod";
import { format } from "date-fns";

const ANNUAL_BINDER_TYPES = new Set(["annual_report", "capital_declaration"]);

export const receiveBinderSchema = z
  .object({
    client_id: z.number({ error: "נא לבחור לקוח" }).positive("נא לבחור לקוח"),
    business_id: z
      .number({ error: "נא לבחור עסק" })
      .positive("נא לבחור עסק")
      .nullable()
      .optional(),
    binder_type: z.string().min(1, "נא לבחור סוג חומר"),
    annual_report_id: z.number().positive("נא לבחור דוח שנתי").nullable().optional(),
    period_year: z
      .number({ error: "נא לבחור שנת דיווח" })
      .int("נא לבחור שנת דיווח")
      .min(2000, "נא לבחור שנת דיווח"),
    period_month_start: z.number().int().min(1).max(12).nullable().optional(),
    period_month_end: z.number().int().min(1).max(12).nullable().optional(),
    received_at: z
      .string()
      .min(1, "נא לבחור תאריך קבלה")
      .refine((value) => value <= format(new Date(), "yyyy-MM-dd"), "לא ניתן לבחור תאריך עתידי"),
    open_new_binder: z.boolean().optional(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.binder_type !== "vat" && data.business_id === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "נא לבחור עסק",
        path: ["business_id"],
      });
    }

    if (!data.period_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "נא לבחור שנת דיווח",
        path: ["period_year"],
      });
    }

    if (ANNUAL_BINDER_TYPES.has(data.binder_type)) {
      return;
    }

    if (data.period_month_start == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "נא לבחור חודש דיווח",
        path: ["period_month_start"],
      });
    }
  });

export type ReceiveBinderFormValues = z.infer<typeof receiveBinderSchema>;
