import { cn } from "../../utils/utils";
import { FormField } from "./FormField";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  className,
  options,
  children,
  ...props
}) => (
  <FormField label={label} error={error}>
    <select
      className={cn(
        "w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
        error ? "border-red-500" : "border-gray-300",
        className,
      )}
      {...props}
    >
      {Array.isArray(options)
        ? options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  </FormField>
);
