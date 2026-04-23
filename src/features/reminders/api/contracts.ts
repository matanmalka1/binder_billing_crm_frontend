import { z } from "zod";

export const reminderTypeValues = [
  "tax_deadline_approaching",
  "vat_filing",
  "annual_report_deadline",
  "advance_payment_due",
  "binder_idle",
  "unpaid_charge",
  "document_missing",
  "custom",
] as const;

export type ReminderType = (typeof reminderTypeValues)[number];

export const reminderStatusValues = [
  "pending",
  "processing",
  "sent",
  "canceled",
] as const;

export type ReminderStatus = (typeof reminderStatusValues)[number];

export const reminderTypeLabels: Record<ReminderType, string> = {
  tax_deadline_approaching: "מועד מס מתקרב",
  vat_filing: 'הגשת דוח מע"מ',
  annual_report_deadline: "מועד דוח שנתי",
  advance_payment_due: "מקדמה לתשלום",
  binder_idle: "תיק לא פעיל",
  unpaid_charge: "חשבונית שלא שולמה",
  document_missing: "מסמך חסר",
  custom: "התאמה אישית",
};

export const reminderStatusLabels: Record<ReminderStatus, string> = {
  pending: "ממתין",
  processing: "בתהליך",
  sent: "נשלח",
  canceled: "בוטל",
};

export const reminderStatusVariants: Record<ReminderStatus, "success" | "error" | "warning" | "neutral"> = {
  sent: "success",
  canceled: "error",
  pending: "warning",
  processing: "warning",
};

export const reminderTypeOptions = reminderTypeValues.map((value) => ({
  value,
  label: reminderTypeLabels[value],
}));

export interface Reminder {
  id: number;
  business_id: number | null;
  business_name: string | null;
  client_record_id: number | null;
  client_name: string | null;
  client_id_number: string | null;
  office_client_number: number | null;
  reminder_type: ReminderType;
  status: ReminderStatus;
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  binder_id: number | null;
  charge_id: number | null;
  tax_deadline_id: number | null;
  annual_report_id: number | null;
  advance_payment_id: number | null;
  created_at: string;
  created_by: number | null;
  sent_at: string | null;
  canceled_at: string | null;
  canceled_by: number | null;
  display_label: string | null;
}

const positiveIdSchema = z.number().int().positive();

// Client-scoped types derive their owner from the linked entity — only FK + scheduling needed.
const clientScopedBase = z.object({
  target_date: z.string().min(1),
  days_before: z.number().int().min(0),
  message: z.string().optional(),
});

// Business-scoped types must explicitly name the business.
const businessScopedBase = z.object({
  business_id: positiveIdSchema,
  target_date: z.string().min(1),
  days_before: z.number().int().min(0),
  message: z.string().optional(),
});

export const createReminderRequestSchema = z.discriminatedUnion("reminder_type", [
  // ── Client-scoped ────────────────────────────────────────────────────────────
  clientScopedBase.extend({
    reminder_type: z.literal("tax_deadline_approaching"),
    client_record_id: positiveIdSchema,
    tax_deadline_id: positiveIdSchema,
  }),
  clientScopedBase.extend({
    reminder_type: z.literal("vat_filing"),
    tax_deadline_id: positiveIdSchema,
  }),
  clientScopedBase.extend({
    reminder_type: z.literal("annual_report_deadline"),
    annual_report_id: positiveIdSchema,
  }),
  clientScopedBase.extend({
    reminder_type: z.literal("binder_idle"),
    binder_id: positiveIdSchema,
  }),
  // ── Business-scoped ──────────────────────────────────────────────────────────
  businessScopedBase.extend({
    reminder_type: z.literal("advance_payment_due"),
    advance_payment_id: positiveIdSchema,
  }),
  businessScopedBase.extend({
    reminder_type: z.literal("unpaid_charge"),
    charge_id: positiveIdSchema,
  }),
  businessScopedBase.extend({
    reminder_type: z.literal("document_missing"),
  }),
  businessScopedBase.extend({
    reminder_type: z.literal("custom"),
    message: z.string().min(1),
  }),
]);

export type CreateReminderRequest = z.infer<typeof createReminderRequestSchema>;

export interface RemindersListResponse {
  items: Reminder[];
  page: number;
  page_size: number;
  total: number;
}
