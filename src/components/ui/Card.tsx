import { cn } from "../../utils/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, footer }) => {
  return (
    <div
      className={cn(
        "bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden",
        className,
      )}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">{footer}</div>
      )}
    </div>
  );
};
