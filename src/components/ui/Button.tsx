import type { ReactNode } from "react";
import { cn } from "../../utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    gradient:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "transition-all duration-200",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      <span className={cn("inline-flex items-center gap-2", isLoading && "opacity-0")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
};
