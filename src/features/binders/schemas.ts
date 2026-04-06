import { z } from "zod";
import { format } from "date-fns";

export const receiveBinderSchema = z
  .object({
    client_id: z.number({ error: "נא לבחור לקוח" }).positive("נא לבחור לקוח"),
    business_id: z
      .number({ error: "נא לבחור עסק" })
      .positive("נא לבחור עסק")
      .nullable()
      .refine((value) => value !== undefined, "נא לבחור עסק"),
    binder_type: z.string().min(1, "נא לבחור סוג חומר"),
    annual_report_id: z.number().positive("נא לבחור דוח שנתי").nullable().optional(),
    reporting_period: z.string().nullable().optional(),
    received_at: z
      .string()
      .min(1, "נא לבחור תאריך קבלה")
      .refine((value) => value <= format(new Date(), "yyyy-MM-dd"), "לא ניתן לבחור תאריך עתידי"),
    open_new_binder: z.boolean().optional(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.binder_type && (!data.reporting_period || data.reporting_period.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "נא לבחור תקופת דיווח",
        path: ["reporting_period"],
      });
    }
  });

export type ReceiveBinderFormValues = z.infer<typeof receiveBinderSchema>;
