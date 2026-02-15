import React from "react";
import { cn } from "../../utils/utils";
import { Card } from "./Card";

export interface ErrorCardProps {
  message: string;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message, className }) => {
  return (
    <Card className={cn("border-red-200 bg-red-50", className)}>
      <p className="text-red-600">{message}</p>
    </Card>
  );
};
