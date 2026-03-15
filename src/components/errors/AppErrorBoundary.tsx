import React from "react";
import { AlertTriangle } from "lucide-react";
import { StateCard } from "../ui/StateCard";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("App crashed in error boundary", { error, errorInfo, stack: error.stack, componentStack: errorInfo.componentStack });
    this.setState({ error, errorInfo });
  }

  private handleReload = (): void => { window.location.reload(); };
  private handleGoHome = (): void => { window.location.href = "/"; };
  private handleReset = (): void => { this.setState({ hasError: false, error: null, errorInfo: null }); };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      const devDetails = isDevelopment && this.state.error
        ? `${this.state.error.toString()}${this.state.error.stack ? `\n\n${this.state.error.stack}` : ""}`
        : undefined;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <StateCard
              icon={AlertTriangle}
              variant="error"
              title="אירעה שגיאה בלתי צפויה"
              message="אנו מתנצלים על אי הנוחות. צוות הפיתוח קיבל התראה על הבעיה."
              details={devDetails}
              action={{ label: "טען מחדש את הדף", onClick: this.handleReload }}
              secondaryAction={{ label: "חזור לדף הבית", onClick: this.handleGoHome }}
            />
            {isDevelopment && (
              <div className="mt-3 text-center">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                  onClick={this.handleReset}
                >
                  נסה שוב (ללא רענון)
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
