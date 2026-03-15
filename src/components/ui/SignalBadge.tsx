import { cn } from "../../utils/utils";

interface SignalBadgeProps {
  signal: string;
  label: string;
  variant?: "warning" | "info" | "neutral";
  dotColor?: string;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ signal, label, variant = "neutral", dotColor }) => {
  const variantClasses = {
    warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    neutral: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
  };

  return (
    <span
      key={signal}
      title={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor ?? "bg-gray-400")} />
      {label}
    </span>
  );
};

SignalBadge.displayName = "SignalBadge";
