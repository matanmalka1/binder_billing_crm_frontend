import { cn } from "../../../utils/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className,
  containerClassName,
  inputClassName,
  ...props
}) => {
  const checkbox = (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        inputClassName,
        className,
      )}
      {...props}
    />
  );

  if (!label && !description) {
    return checkbox;
  }

  return (
    <label className={cn("flex cursor-pointer select-none items-start gap-2", containerClassName)}>
      {checkbox}
      <span className="min-w-0">
        {label ? <span className="block text-sm font-medium text-gray-700">{label}</span> : null}
        {description ? <span className="block text-xs text-gray-500">{description}</span> : null}
      </span>
    </label>
  );
};

Checkbox.displayName = "Checkbox";
