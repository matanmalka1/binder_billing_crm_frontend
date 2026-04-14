import type { AnnualReportFull } from "./api";
import type {
  AnnualReportStatus,
  StatusTransitionPayload,
} from "./api";
import type { ChangeEvent } from "react";

export const STAGE_ORDER = [
  "material_collection",
  "in_progress",
  "final_review",
  "client_signature",
  "transmitted",
  "post_submission",
] as const;

export type StageKey = (typeof STAGE_ORDER)[number];

export interface KanbanStage {
  stage: StageKey;
  reports: {
    id: number;
    business_name: string;
    tax_year: number;
    days_until_due: number | null;
  }[];
}

export type ActiveTab = "kanban" | "season" | "status";

export const TAB_LABELS: Record<ActiveTab, string> = {
  kanban: "קנבן",
  season: "עונה",
  status: "סטטוס",
};

export const CURRENT_YEAR = new Date().getFullYear();

export const KANBAN_PAGE_SIZE = 6;

export const SECTION_KEYS = [
  "overview",
  "financials",
  "tax",
  "deductions",
  "documents",
  "timeline",
  "charges",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface AnnualReportDetail extends AnnualReportFull {
  tax_refund_amount: number | null;
  tax_due_amount: number | null;
  client_approved_at: string | null;
  internal_notes: string | null;
  stage?: StageKey;
  due_date?: string | null;
}

export interface TransitionForm {
  note: string;
  itaRef: string;
  assessmentAmount: string;
  refundDue: string;
  taxDue: string;
}

export interface StatusTransitionPanelProps {
  report: AnnualReportFull;
  onTransition: (payload: StatusTransitionPayload) => void;
  isLoading: boolean;
}

export interface AmendReportModalProps {
  open: boolean;
  reason: string;
  isPending: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export interface TransitionTargetSelectorProps {
  allowed: AnnualReportStatus[];
  selected: AnnualReportStatus | null;
  onSelect: (status: AnnualReportStatus) => void;
}

export interface TransitionDetailsFormProps {
  selected: AnnualReportStatus;
  form: TransitionForm;
  isLoading: boolean;
  onFieldChange: (field: keyof TransitionForm) => (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}
