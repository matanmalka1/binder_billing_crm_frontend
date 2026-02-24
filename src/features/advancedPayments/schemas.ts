import { z } from "zod";

export const createAdvancePaymentSchema = z.object({
  month: z
    .number({ error: "יש לבחור חודש" })
    .int()
    .min(1, "חודש חייב להיות בין 1 ל-12")
    .max(12, "חודש חייב להיות בין 1 ל-12"),
  due_date: z.string().min(1, "יש להזין תאריך יעד"),
  expected_amount: z.number().min(0, "הסכום חייב להיות חיובי").nullable(),
  paid_amount: z.number().min(0, "הסכום חייב להיות חיובי").nullable(),
});

export type CreateAdvancePaymentFormValues = z.infer<typeof createAdvancePaymentSchema>;