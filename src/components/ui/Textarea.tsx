import React from "react";
import { cn } from "../../utils/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <label className={cn("block space-y-1 text-sm", className)}>
      {label && (
        <span className="font-medium text-gray-700">{label}</span>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all",
          "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
          error && "border-red-300 focus:border-red-400 focus:ring-red-200"
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
};

Textarea.displayName = "Textarea";
