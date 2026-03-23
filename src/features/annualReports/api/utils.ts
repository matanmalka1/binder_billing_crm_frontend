import { makeClassGetter, makeLabelGetter } from "@/utils/labels";
import type { AnnualReportStatus, ClientTypeForReport, AnnualReportScheduleKey } from "./contracts";

// ── Status labels ──────────────────────────────────────────────────────────

const statusLabels: Record<AnnualReportStatus, string> = {
  not_started: "טרם התחיל",
  collecting_docs: "איסוף מסמכים",
  docs_complete: "מסמכים התקבלו",
  in_preparation: "בהכנה",
  pending_client: "ממתין לאישור לקוח",
  submitted: "הוגש",
  accepted: "התקבל",
  assessment_issued: "שומה הוצאה",
  objection_filed: "השגה הוגשה",
  closed: "סגור",
  amended: "תיקון דוח",
};

export const getStatusLabel = (status: string): string =>
  (statusLabels as Record<string, string>)[status] ?? status;

// ── Status badge variants ──────────────────────────────────────────────────

type BadgeVariant = "neutral" | "info" | "warning" | "success" | "error";

const statusVariants: Record<AnnualReportStatus, BadgeVariant> = {
  not_started: "neutral",
  collecting_docs: "info",
  docs_complete: "info",
  in_preparation: "info",
  pending_client: "warning",
  submitted: "success",
  accepted: "success",
  assessment_issued: "warning",
  objection_filed: "error",
  closed: "neutral",
  amended: "warning",
};

export const getStatusVariant = (status: string): BadgeVariant =>
  (statusVariants as Record<string, BadgeVariant>)[status] ?? "neutral";

const validTransitions: Record<AnnualReportStatus, AnnualReportStatus[]> = {
  not_started: ["collecting_docs"],
  collecting_docs: ["docs_complete", "not_started"],
  docs_complete: ["in_preparation", "collecting_docs"],
  in_preparation: ["pending_client", "docs_complete"],
  pending_client: ["in_preparation", "submitted"],
  submitted: ["accepted", "assessment_issued"],
  accepted: ["closed"],
  assessment_issued: ["objection_filed", "closed", "pending_client", "in_preparation", "docs_complete"],
  objection_filed: ["closed", "docs_complete"],
  closed: [],
  amended: ["in_preparation", "collecting_docs"],
};

export const getAllowedTransitions = (status: string): AnnualReportStatus[] =>
  (validTransitions as Record<string, AnnualReportStatus[]>)[status] ?? [];

// ── Client type labels ────────────────────────────────────────────────────

const clientTypeLabels: Record<ClientTypeForReport, string> = {
  individual: "יחיד (1301)",
  self_employed: "עצמאי (1215)",
  corporation: "חברה (6111)",
  partnership: "שותפות (1215)",
};

export const getClientTypeLabel = (type: string): string =>
  (clientTypeLabels as Record<string, string>)[type] ?? type;

// ── Schedule labels ────────────────────────────────────────────────────────

const scheduleLabels: Record<AnnualReportScheduleKey, string> = {
  schedule_b: "נספח ב — שכירות",
  schedule_bet: "נספח בית — רווחי הון",
  schedule_gimmel: 'נספח ג — הכנסות מחו"ל',
  schedule_dalet: "נספח ד — פחת",
  schedule_heh: "נספח ה — שכר דירה פטור",
};

export const getScheduleLabel = (key: string): string =>
  (scheduleLabels as Record<string, string>)[key] ?? key;

// ── Season progress helpers ────────────────────────────────────────────────

export const SEASON_PROGRESS_STAGES = [
  { key: "not_started" as AnnualReportStatus, label: "טרם התחיל", color: "bg-gray-400" },
  { key: "collecting_docs" as AnnualReportStatus, label: "איסוף מסמכים", color: "bg-primary-400" },
  { key: "in_preparation" as AnnualReportStatus, label: "בהכנה", color: "bg-purple-400" },
  { key: "pending_client" as AnnualReportStatus, label: "ממתין ללקוח", color: "bg-amber-400" },
  { key: "submitted" as AnnualReportStatus, label: "הוגש", color: "bg-green-400" },
  { key: "closed" as AnnualReportStatus, label: "סגור", color: "bg-emerald-600" },
];

// ── Stage labels (from annualReport.utils.ts) ─────────────────────────────

const stageLabels = {
  material_collection: "איסוף חומרים",
  in_progress: "בטיפול",
  final_review: "סקירה סופית",
  client_signature: "חתימת לקוח",
  transmitted: "הועבר",
  post_submission: "לאחר הגשה",
};

const reportStatusLabels = {
  not_started: "טרם התחיל",
  in_progress: "בתהליך",
  submitted: "הוגש",
  completed: "הושלם",
};

const stageColors = {
  material_collection: "bg-gray-100 text-gray-700",
  in_progress: "bg-primary-100 text-primary-700",
  final_review: "bg-purple-100 text-purple-700",
  client_signature: "bg-orange-100 text-orange-700",
  transmitted: "bg-green-100 text-green-700",
  post_submission: "bg-yellow-100 text-yellow-800",
};

export const getReportStageLabel = makeLabelGetter(stageLabels);
export const getReportStatusLabel = makeLabelGetter(reportStatusLabels);
export const getStageColor = makeClassGetter(stageColors, "material_collection");
