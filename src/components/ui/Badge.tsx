import React from "react";
import { cn } from "../../utils/utils";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Dot color class for signal-style badges (e.g. "bg-red-400") */
  dot?: string;
  /** Adds ring-1 for signal-style appearance */
  ring?: boolean;
  /** Shows × remove button (active-filter pill mode) */
  removable?: boolean;
  onRemove?: () => void;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-primary-100 text-primary-800",
  neutral: "bg-gray-100 text-gray-800",
};

const signalVariantClasses: Record<BadgeVariant, string> = {
  warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
  info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  neutral: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
  success: "bg-green-50 text-green-700 ring-1 ring-green-200",
  error: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  dot,
  ring,
  removable,
  onRemove,
  onClick,
  className,
}) => {
  if (removable) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 py-0.5 pe-2.5 ps-1.5 text-xs font-medium text-primary-800",
        className,
      )}>
        {children}
        <button
          type="button"
          onClick={onRemove}
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-200 transition-colors"
          aria-label={`הסר סינון`}
        >
          ×
        </button>
      </span>
    );
  }

  if (dot !== undefined || ring) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
          signalVariantClasses[variant],
          className,
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dot ?? "bg-gray-400")} />
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
