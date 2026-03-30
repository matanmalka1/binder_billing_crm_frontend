import { z } from "zod";

const DEFAULT_REMINDER_DAYS_BEFORE = 7;

// Reusable: numeric string that must parse to a positive integer
const positiveIdString = (fieldLabel: string) =>
  z
    .string()
    .min(1, `נא להזין ${fieldLabel}`)
    .refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, `נא להזין ${fieldLabel} תקין`);

const baseFields = {
  // client_id is always a string in the form; required and must be a positive integer.
  // When fixedClientId is provided the hook pre-populates this before submission.
  client_id: positiveIdString("מזהה לקוח"),
  target_date: z.string().min(1, "נא לבחור תאריך יעד"),
  days_before: z
    .number({ error: "נא להזין מספר ימים" })
    .int("נא להזין מספר שלם")
    .min(0, "מספר ימים לפני חייב להיות אפס או יותר"),
};

// FK id fields that are irrelevant for a given type are present but optional/empty
const unusedIds = {
  tax_deadline_id: z.string().optional(),
  binder_id: z.string().optional(),
  charge_id: z.string().optional(),
};

const buildEntityReminderSchema = <
  TReminderType extends "tax_deadline_approaching" | "binder_idle" | "unpaid_charge",
  TField extends "tax_deadline_id" | "binder_id" | "charge_id",
>(
  reminderType: TReminderType,
  requiredField: TField,
  fieldLabel: string,
) =>
  z.object({
    ...baseFields,
    reminder_type: z.literal(reminderType),
    ...unusedIds,
    [requiredField]: positiveIdString(fieldLabel),
    message: z.string().optional(),
  });

export const createReminderSchema = z.discriminatedUnion("reminder_type", [
  buildEntityReminderSchema("tax_deadline_approaching", "tax_deadline_id", "מזהה מועד מס"),
  buildEntityReminderSchema("binder_idle", "binder_id", "מזהה תיק"),
  buildEntityReminderSchema("unpaid_charge", "charge_id", "מזהה חשבונית"),
  z.object({
    ...baseFields,
    reminder_type: z.literal("custom"),
    message: z.string().min(1, "נא להזין הודעת תזכורת"),
    ...unusedIds,
  }),
]);

export type CreateReminderFormValues = z.infer<typeof createReminderSchema>;

export const createReminderDefaultValues = {
  reminder_type: "custom" as const,
  client_id: "",
  target_date: "",
  days_before: DEFAULT_REMINDER_DAYS_BEFORE,
  message: "",
  tax_deadline_id: "",
  binder_id: "",
  charge_id: "",
};
