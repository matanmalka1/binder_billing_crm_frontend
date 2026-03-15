import type { ReactNode, FC } from "react";
import { PageLoading } from "./PageLoading";
import { Alert } from "./Alert";

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
  return (
    <div className="space-y-6">
      {header}
      {isLoading && <PageLoading message={loadingMessage} />}
      {error && <Alert variant="error" message={error} />}
      {!isLoading && !error && children}
    </div>
  );
};
