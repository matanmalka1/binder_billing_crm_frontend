import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../../utils/utils";

export interface AccessBannerProps {
  message: string;
  variant?: "warning" | "info" | "error" | "success";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AccessBanner: React.FC<AccessBannerProps> = ({
  message,
  variant = "warning",
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variants = {
    warning: {
      container: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/80",
      icon: "text-orange-600",
      text: "text-orange-900",
      iconBg: "bg-orange-100",
      Icon: AlertTriangle,
    },
    info: {
      container: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/80",
      icon: "text-blue-600",
      text: "text-blue-900",
      iconBg: "bg-blue-100",
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

  const config = variants[variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4 shadow-sm",
        "transition-all duration-300 animate-slide-in",
        config.container,
        className
      )}
      role="alert"
    >
      {/* Icon with background */}
      <div className={cn("rounded-lg p-2 shrink-0", config.iconBg)}>
        <IconComponent className={cn("h-5 w-5", config.icon)} />
      </div>

      {/* Message */}
      <div className="flex-1 pt-0.5">
        <p className={cn("text-sm font-medium leading-relaxed", config.text)}>
          {message}
        </p>
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            "shrink-0 rounded-lg p-1.5 transition-colors",
            "hover:bg-white/50",
            config.text
          )}
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