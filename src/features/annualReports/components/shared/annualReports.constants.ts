import type { AnnualReportFull } from "../../api";

export const STATUS_LABELS: Record<AnnualReportFull["status"], string> = {
  not_started: "טרם החל",
  collecting_docs: "איסוף מסמכים",
  docs_complete: "מסמכים הושלמו",
  in_preparation: "בהכנה",
  pending_client: "ממתין ללקוח",
  submitted: "הוגש",
  accepted: "התקבל",
  assessment_issued: "שומה הוצאה",
  objection_filed: "הגשת השגה",
  closed: "סגור",
  amended: "עם תיקונים",
};

export const formatAnnualReportDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL");
};
