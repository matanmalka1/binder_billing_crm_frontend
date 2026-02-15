import { AlertTriangle, Info } from "lucide-react";
import { cn } from "../../utils/utils";

export interface AccessBannerProps {
  message: string;
  variant?: "warning" | "info";
  className?: string;
}

export const AccessBanner: React.FC<AccessBannerProps> = ({
  message,
  variant = "warning",
  className,
}) => {
  const variants = {
    warning: {
      container: "bg-orange-50 border-orange-200",
      icon: "text-orange-600",
      text: "text-orange-800",
      Icon: AlertTriangle,
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
      Icon: Info,
    },
  };

  const config = variants[variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        config.container,
        className
      )}
      role="alert"
    >
      <IconComponent className={cn("h-5 w-5 shrink-0", config.icon)} />
      <p className={cn("text-sm font-medium", config.text)}>{message}</p>
    </div>
  );
};
