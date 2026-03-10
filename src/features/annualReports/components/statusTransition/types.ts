import type { ChangeEvent } from "react";
import type {
  AnnualReportFull,
  AnnualReportStatus,
  ReadinessCheckResponse,
  StatusTransitionPayload,
} from "../../../../api/annualReports.api";
import type { TransitionForm } from "../../utils";

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
  readiness?: ReadinessCheckResponse;
  isLoading: boolean;
  onFieldChange: (field: keyof TransitionForm) => (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}
