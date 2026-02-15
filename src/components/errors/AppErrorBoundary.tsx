import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

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
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to error reporting service (e.g., Sentry)
    console.error("App crashed in error boundary", {
      error,
      errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = "/";
  };

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              {/* Title & Message */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  אירעה שגיאה בלתי צפויה
                </h1>
                <p className="text-gray-600">
                  אנו מתנצלים על אי הנוחות. צוות הפיתוח קיבל התראה על הבעיה.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && this.state.error && (
                <div className="text-right bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    פרטי שגיאה (מצב פיתוח בלבד):
                  </h3>
                  <div className="text-xs font-mono text-red-600 whitespace-pre-wrap break-all">
                    {this.state.error.toString()}
                  </div>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-900">
                        הצג מחסנית קריאות
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap break-all overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleReload}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  טען מחדש את הדף
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  חזור לדף הבית
                </Button>

                {isDevelopment && (
                  <Button
                    variant="ghost"
                    onClick={this.handleReset}
                  >
                    נסה שוב (ללא רענון)
                  </Button>
                )}
              </div>

              {/* Support Info */}
              <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                אם הבעיה נמשכת, אנא פנה לתמיכה הטכנית
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
