import {
  getSignalLabel,
} from "../utils/enums";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const SIGNAL_TYPE_OPTIONS: Option[] = [
  { value: "missing_permanent_documents", label: getSignalLabel("missing_permanent_documents") },
  { value: "ready_for_pickup", label: getSignalLabel("ready_for_pickup") },
  { value: "unpaid_charges", label: getSignalLabel("unpaid_charges") },
  { value: "idle_binder", label: getSignalLabel("idle_binder") },
];

export const PAGE_SIZE_OPTIONS: Option[] = [
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export const getResultTypeLabel = (resultType: string) => {
  if (resultType === "binder") return "קלסר";
  if (resultType === "client") return "לקוח";
  return "—";
};
