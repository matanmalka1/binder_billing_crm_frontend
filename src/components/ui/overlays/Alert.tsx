import { AlertTriangle, Info, AlertCircle, CheckCircle, RotateCcw } from "lucide-react";
import { cn } from "../../../utils/utils";

interface AlertProps {
  message: string;
  variant?: "warning" | "info" | "error" | "success";
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Shows a retry button — only meaningful with variant="error" */
  onRetry?: () => void;
  className?: string;
}

const config = {
  warning: {
    container: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/80",
    icon: "text-orange-600",
    text: "text-orange-900",
    iconBg: "bg-orange-100",
    Icon: AlertTriangle,
  },
  info: {
    container: "bg-gradient-to-r from-primary-50 to-cyan-50 border-primary-200/80",
    icon: "text-primary-600",
    text: "text-primary-900",
    iconBg: "bg-primary-100",
    Icon: Info,
  },
  error: {
    container: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200/80",
    icon: "text-red-600",
    text: "text-red-900",
    iconBg: "bg-red-100",
    Icon: AlertCircle,
  },
  success: {
    container: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/80",
    icon: "text-green-600",
    text: "text-green-900",
    iconBg: "bg-green-100",
    Icon: CheckCircle,
  },
};

export const Alert: React.FC<AlertProps> = ({
  message,
  variant = "warning",
  dismissible = false,
  onDismiss,
  onRetry,
  className,
}) => {
  const c = config[variant];
  const Icon = c.Icon;

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4 shadow-sm",
        "transition-all duration-300 animate-slide-in",
        c.container,
        className,
      )}
      role="alert"
    >
      <div className={cn("rounded-lg p-2 shrink-0", c.iconBg)}>
        <Icon className={cn("h-5 w-5", c.icon)} />
      </div>

      <div className="flex-1 pt-0.5">
        <p className={cn("text-sm font-medium leading-relaxed", c.text)}>{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          נסה שנית
        </button>
      )}

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn("shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/50", c.text)}
          aria-label="סגור התראה"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = "Alert";
