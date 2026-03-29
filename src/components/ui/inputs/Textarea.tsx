import React from "react";
import { cn } from "../../../utils/utils";
import { FormField } from "./FormField";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => (
  <FormField label={label} error={error} className={cn("text-sm", className)}>
    <textarea
      className={cn(
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all",
        "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
        error && "border-red-300 focus:border-red-400 focus:ring-red-200",
      )}
      {...props}
    />
  </FormField>
);

Textarea.displayName = "Textarea";
