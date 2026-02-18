import type { ReactNode, FC } from "react";
import { PageLoading } from "./PageLoading";
import { ErrorCard } from "./ErrorCard";

interface PageStateGuardProps {
  isLoading: boolean;
  error: string | null;
  header: ReactNode;
  loadingMessage?: string;
  children: ReactNode;
}

export const PageStateGuard: FC<PageStateGuardProps> = ({
  isLoading,
  error,
  header,
  loadingMessage = "טוען...",
  children,
}) => {
  if (isLoading || error) {
    return (
      <div className="space-y-6">
        {header}
        {isLoading && <PageLoading message={loadingMessage} />}
        {error && <ErrorCard message={error} />}
      </div>
    );
  }

  return <>{children}</>;
};
