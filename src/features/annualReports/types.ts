import type { AnnualReportFull } from "../../api/annualReports.api";

export const STAGE_ORDER = [
  "material_collection",
  "in_progress",
  "final_review",
  "client_signature",
  "transmitted",
] as const;

export type StageKey = (typeof STAGE_ORDER)[number];

export interface KanbanStage {
  stage: StageKey;
  reports: {
    id: number;
    client_id: number;
    client_name: string;
    tax_year: number;
    days_until_due: number | null;
  }[];
}

export type ActiveTab = "kanban" | "season";

export const TAB_LABELS: Record<ActiveTab, string> = {
  kanban: "קנבן",
  season: "עונה",
};

export const CURRENT_YEAR = new Date().getFullYear();

export const KANBAN_PAGE_SIZE = 6;

export interface AnnualReportDetail extends AnnualReportFull {
  tax_refund_amount: number | null;
  tax_due_amount: number | null;
  client_approved_at: string | null;
  internal_notes: string | null;
  stage?: StageKey;
  due_date?: string | null;
}
