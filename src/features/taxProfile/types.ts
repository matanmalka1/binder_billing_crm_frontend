import type { TaxProfileData, TaxProfileUpdatePayload } from "./api";
import type { TaxProfileFormValues } from "./schemas";

export type { TaxProfileUpdatePayload };

export interface TaxProfileQueryParams {
  clientId: number;
}

export interface TaxProfileCardProps {
  clientId: number | null;
  readOnly?: boolean;
}

export interface TaxProfileFormProps {
  profile: TaxProfileData | null;
  onSave: (data: TaxProfileUpdatePayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface TaxProfileFormState {
  values: TaxProfileFormValues;
  isDirty: boolean;
  isValid: boolean;
}
