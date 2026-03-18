import { z } from "zod";
import { format } from "date-fns";

export const receiveBinderSchema = z.object({
  client_id: z.number({ error: "נא לבחור לקוח" }).positive("נא לבחור לקוח"),
  binder_type: z.string().min(1, "נא לבחור סוג חומר"),
  binder_number: z.string().min(1, "נא להזין מספר קלסר"),
  vat_period: z.string().nullable().optional(),
  received_at: z
    .string()
    .min(1, "נא לבחור תאריך קבלה")
    .refine((value) => value <= format(new Date(), "yyyy-MM-dd"), "לא ניתן לבחור תאריך עתידי"),
  notes: z.string().optional().nullable(),
});

export type ReceiveBinderFormValues = z.infer<typeof receiveBinderSchema>;
