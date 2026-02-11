import React from "react";
import { cn } from "../../utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

/**
 * Loader - Dedicated loading indicator primitive
 *
 * Sprint 1 requirement: explicit Loader component
 * Wraps Spinner with optional message for consistency
 */
export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  message,
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-solid border-blue-600 border-t-transparent",
          sizes[size],
        )}
      />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};
