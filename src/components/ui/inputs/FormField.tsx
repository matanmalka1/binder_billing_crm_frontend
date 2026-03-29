import { cn } from "../../../utils/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactElement;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children, className }) => (
  <div className={cn("w-full space-y-1", className)}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

FormField.displayName = "FormField";
