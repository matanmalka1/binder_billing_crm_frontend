import React from "react";
import { cn } from "../../utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, leftIcon, rightIcon, rightElement, ...props }, ref) => {
    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon || rightElement);

    return (
      <div className="w-full space-y-1">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border px-3 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm",
              error ? "border-red-500" : "border-gray-300",
              props.disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white",
              hasLeft ? "pl-11" : "pl-3",
              hasRight ? "pr-11" : "pr-3",
              className,
            )}
            {...props}
          />

          {rightElement ? (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</span>
          ) : (
            rightIcon && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
