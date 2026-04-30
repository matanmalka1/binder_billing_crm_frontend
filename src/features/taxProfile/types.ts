import type { TaxProfileData, TaxProfileUpdatePayload } from './api'

export type { TaxProfileUpdatePayload }

export interface TaxProfileCardProps {
  clientId: number | null
  readOnly?: boolean
}

export interface TaxProfileFormProps {
  profile: TaxProfileData | null
  onSave: (data: TaxProfileUpdatePayload) => void
  onCancel: () => void
  isSaving: boolean
  hideFooter?: boolean
  formId?: string
}
