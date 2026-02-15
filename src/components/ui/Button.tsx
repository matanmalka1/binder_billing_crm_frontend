import { cn } from "../../utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const variants = {
    primary: cn(
      "bg-gradient-to-r from-primary-600 to-primary-700",
      "text-white shadow-sm",
      "hover:from-primary-700 hover:to-primary-800",
      "hover:shadow-md hover:-translate-y-0.5",
      "active:translate-y-0",
      "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    ),
    secondary: cn(
      "bg-gradient-to-r from-gray-100 to-gray-200",
      "text-gray-900 shadow-sm",
      "hover:from-gray-200 hover:to-gray-300",
      "hover:shadow-md hover:-translate-y-0.5",
      "active:translate-y-0",
      "focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    ),
    outline: cn(
      "bg-white border-2 border-gray-300",
      "text-gray-700",
      "hover:bg-gray-50 hover:border-gray-400",
      "hover:shadow-sm hover:-translate-y-0.5",
      "active:translate-y-0",
      "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    ),
    ghost: cn(
      "bg-transparent",
      "text-gray-700",
      "hover:bg-gray-100",
      "focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    ),
    gradient: cn(
      "bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500",
      "text-white shadow-lg",
      "hover:shadow-xl hover:-translate-y-1",
      "active:translate-y-0",
      "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    ),
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2",
        "rounded-lg font-medium",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:hover:transform-none",
        "focus:outline-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
};