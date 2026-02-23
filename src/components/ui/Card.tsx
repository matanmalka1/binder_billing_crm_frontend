import React from "react";
import { cn } from "../../utils/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "elevated";
  interactive?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  footer,
  variant = "default",
  interactive = false,
  style,
}) => {
  const variants = {
    default: "bg-white border border-gray-200/80",
    elevated: "bg-white border-0 shadow-elevation-2",
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-200",
        variants[variant],
        interactive &&
          "hover:shadow-elevation-3 hover:-translate-y-0.5 cursor-pointer",
        "animate-fade-in",
        className,
      )}
    style={style}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-transparent flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-100/80 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};
