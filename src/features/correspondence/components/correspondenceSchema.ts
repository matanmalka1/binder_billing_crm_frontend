import { z } from "zod";

export const correspondenceSchema = z.object({
  correspondence_type: z.enum(["call", "letter", "email", "meeting"]),
  subject: z.string().trim().min(1, "יש להזין נושא"),
  notes: z.string().trim().optional().or(z.literal("")),
  occurred_at: z.string().trim().min(1, "יש להזין תאריך"),
});

export type CorrespondenceFormValues = z.infer<typeof correspondenceSchema>;

export const correspondenceDefaults: CorrespondenceFormValues = {
  correspondence_type: "call",
  subject: "",
  notes: "",
  occurred_at: new Date().toISOString().split("T")[0],
};
