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
