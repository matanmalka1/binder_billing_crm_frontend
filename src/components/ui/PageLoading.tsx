import React from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

interface PageLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  size = "lg",
  className,
}) => {
  return (
    <div className={cn("flex justify-center py-12", className)}>
      <Spinner size={size} />
    </div>
  );
};
