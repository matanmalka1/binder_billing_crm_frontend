import { z } from "zod";

export const receiveBinderSchema = z.object({
  client_id: z.number({ error: "נא לבחור לקוח" }).positive("נא לבחור לקוח"),
  binder_type: z.string().min(1, "נא לבחור סוג חומר"),
  binder_number: z.string().min(1, "נא להזין מספר קלסר"),
  received_at: z.string().min(1, "נא לבחור תאריך קבלה"),
});

export type ReceiveBinderFormValues = z.infer<typeof receiveBinderSchema>;
