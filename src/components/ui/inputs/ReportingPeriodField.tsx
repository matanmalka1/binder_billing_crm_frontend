import type { ChangeEvent } from 'react'
import { Select } from './Select'
import {
  buildBimonthlyPeriodOptions,
  buildMonthlyPeriodOptions,
  buildYearPeriodOptions,
  type PeriodOption,
} from './periodOptions'

interface ReportingPeriodFieldProps {
  materialType: string
  vatType: 'monthly' | 'bimonthly' | 'exempt' | null
  value: string
  onChange: (value: string) => void
  error?: string
}

const ANNUAL_TYPES = ['annual_report', 'capital_declaration']

export const ReportingPeriodField: React.FC<ReportingPeriodFieldProps> = ({
  materialType,
  vatType,
  value,
  onChange,
  error,
}) => {
  let label = 'תקופת דיווח'
  let options: PeriodOption[]

  if (materialType === 'vat') {
    label = 'תקופת מע"מ'
    options = vatType === 'bimonthly' ? buildBimonthlyPeriodOptions(6) : buildMonthlyPeriodOptions(6)
  } else if (ANNUAL_TYPES.includes(materialType)) {
    label = 'שנת דיווח'
    options = buildYearPeriodOptions(5)
  } else {
    options = buildMonthlyPeriodOptions(12)
  }

  const selectOptions = [{ value: '', label: 'בחר תקופה...' }, ...options]

  const effectiveValue = ANNUAL_TYPES.includes(materialType) && !value ? String(new Date().getFullYear()) : value

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)

  return <Select label={label} error={error} value={effectiveValue} onChange={handleChange} options={selectOptions} />
}

ReportingPeriodField.displayName = 'ReportingPeriodField'
