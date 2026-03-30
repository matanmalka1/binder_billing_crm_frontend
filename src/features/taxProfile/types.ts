import type { TaxProfileData } from "./api";
import type { TaxProfileFormValues } from "./schemas";

export type TaxProfileUpdatePayload = Partial<TaxProfileData>;

export interface TaxProfileQueryParams {
  businessId: number;
}

export interface TaxProfileCardProps {
  businessId: number;
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
