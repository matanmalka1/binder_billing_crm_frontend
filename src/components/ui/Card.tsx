import { cn } from "../../utils/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  variant?: "default" | "elevated";
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  footer,
  variant = "default",
  interactive = false,
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
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-transparent">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
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
