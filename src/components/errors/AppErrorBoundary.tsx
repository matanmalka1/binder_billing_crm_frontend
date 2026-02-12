import React from "react";
import { PageErrorCard } from "../ui/PageErrorCard";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Hook point for future telemetry integration.
    console.error("App crashed in error boundary", { error, errorInfo });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl space-y-4">
            <PageErrorCard message="אירעה שגיאה בלתי צפויה" />
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              טען מחדש
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
