import React, { type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button';
import { Card } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-destructive">오류가 발생했습니다</h2>
            <p className="text-muted-foreground">{this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
            <Button onClick={() => this.setState({ hasError: false, error: undefined })} variant="outline">
              다시 시도
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
