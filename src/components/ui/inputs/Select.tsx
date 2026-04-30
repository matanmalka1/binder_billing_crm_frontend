import { cn } from '../../../utils/utils'
import { FormField } from './FormField'
import { SelectDropdown } from './SelectDropdown'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
}

const ChevronIcon = () => (
  <svg
    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
)

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  className,
  options,
  children,
  value,
  onChange,
  onBlur,
  disabled,
  name,
  ...props
}) => (
  <FormField label={label} error={error} className="w-full">
    {Array.isArray(options) ? (
      <SelectDropdown
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        options={options}
        disabled={disabled}
        name={name}
        className={cn(error ? 'border-negative-500' : undefined, className)}
      />
    ) : (
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          name={name}
          className={cn(
            'appearance-none w-full px-3 py-2.5 pr-9 bg-white border rounded-lg text-sm text-gray-800 cursor-pointer transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-negative-500' : 'border-gray-200',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronIcon />
      </div>
    )}
  </FormField>
)
