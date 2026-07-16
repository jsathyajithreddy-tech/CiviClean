import React from "react";
import { ErrorStateCard } from "../ui/error-state-card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle: string;
  fallbackDescription: string;
  preserveShell?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {}

  private readonly reset = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className={this.props.preserveShell ? "" : "min-h-screen bg-app p-6 text-primary"}>
          <ErrorStateCard
            title={this.props.fallbackTitle}
            description={this.props.fallbackDescription}
            detail={this.state.errorMessage ?? undefined}
            onAction={this.reset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
