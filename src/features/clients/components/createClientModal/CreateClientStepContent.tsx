import type {
  ControllerRenderProps,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from 'react-hook-form'
import type { ClientCreationImpactResponse } from '../../api/contracts'
import type { CreateClientFormValues } from '../../schemas'
import { CreateClientBusinessStep } from './CreateClientBusinessStep'
import { CreateClientIdentityStep } from './CreateClientIdentityStep'
import { CreateClientTaxStep } from './CreateClientTaxStep'

interface Props {
  advisorOptions: Array<{ value: string; label: string }>
  advisorsLoading: boolean
  businessOpenedAtField: ControllerRenderProps<CreateClientFormValues, 'business_opened_at'>
  disabled: boolean
  errors: FieldErrors<CreateClientFormValues>
  clearErrors: UseFormClearErrors<CreateClientFormValues>
  impactData?: ClientCreationImpactResponse
  impactLoading: boolean
  isCompany: boolean
  isExempt: boolean
  register: UseFormRegister<CreateClientFormValues>
  showVatFrequency: boolean
  stepIndex: number
}

export const CreateClientStepContent: React.FC<Props> = ({
  advisorOptions,
  advisorsLoading,
  businessOpenedAtField,
  disabled,
  errors,
  clearErrors,
  impactData,
  impactLoading,
  isCompany,
  isExempt,
  register,
  showVatFrequency,
  stepIndex,
}) => {
  if (stepIndex === 0) {
    return (
      <CreateClientIdentityStep
        disabled={disabled}
        errors={errors}
        isCompany={isCompany}
        clearErrors={clearErrors}
        register={register}
      />
    )
  }

  if (stepIndex === 1) {
    return (
      <CreateClientBusinessStep
        businessOpenedAtField={businessOpenedAtField}
        disabled={disabled}
        errors={errors}
        isCompany={isCompany}
        register={register}
      />
    )
  }

  return (
    <CreateClientTaxStep
      advisorOptions={advisorOptions}
      advisorsLoading={advisorsLoading}
      disabled={disabled}
      errors={errors}
      impactData={impactData}
      impactLoading={impactLoading}
      isExempt={isExempt}
      register={register}
      showVatFrequency={showVatFrequency}
    />
  )
}
