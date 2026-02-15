import {
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
} from "../utils/enums";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const WORK_STATE_OPTIONS: Option[] = [
  { value: "", label: "הכל" },
  { value: "waiting_for_work", label: getWorkStateLabel("waiting_for_work") },
  { value: "in_progress", label: getWorkStateLabel("in_progress") },
  { value: "completed", label: getWorkStateLabel("completed") },
];

export const SLA_STATE_OPTIONS: Option[] = [
  { value: "", label: "הכל" },
  { value: "on_track", label: getSlaStateLabel("on_track") },
  { value: "approaching", label: getSlaStateLabel("approaching") },
  { value: "overdue", label: getSlaStateLabel("overdue") },
];

export const SIGNAL_TYPE_OPTIONS: Option[] = [
  { value: "missing_permanent_documents", label: getSignalLabel("missing_permanent_documents") },
  { value: "near_sla", label: getSignalLabel("near_sla") },
  { value: "overdue", label: getSignalLabel("overdue") },
  { value: "ready_for_pickup", label: getSignalLabel("ready_for_pickup") },
  { value: "unpaid_charges", label: getSignalLabel("unpaid_charges") },
  { value: "idle_binder", label: getSignalLabel("idle_binder") },
];

export const BOOLEAN_OPTIONS: Option[] = [
  { value: "", label: "הכל" },
  { value: "true", label: "כן" },
  { value: "false", label: "לא" },
];

export const PAGE_SIZE_OPTIONS: Option[] = [
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export const getResultTypeLabel = (resultType: string) => {
  if (resultType === "binder") return "תיק";
  if (resultType === "client") return "לקוח";
  return "—";
};
