import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Enhanced Error Boundary with React 19 optimizations
 * Provides better error handling and user experience
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Report error to monitoring service in production
        if (import.meta.env.PROD) {
            this.reportError(error, errorInfo);
        }
    }

    reportError = (error, errorInfo) => {
        // In a real app, you would send this to your error reporting service
        // Example: Sentry, LogRocket, etc.
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errorId: this.state.errorId
        };

        console.log('Error report:', errorReport);

        // Example: Send to monitoring service
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // });
    };

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        });
    };

    render() {
        if (this.state.hasError) {
            const { fallback: Fallback } = this.props;

            // Use custom fallback if provided
            if (Fallback) {
                return (
                    <Fallback
                        error={this.state.error}
                        errorInfo={this.state.errorInfo}
                        onRetry={this.handleRetry}
                    />
                );
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-destructive"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>

                                <h1 className="text-xl font-semibold text-foreground mb-2">
                                    Oops! Something went wrong
                                </h1>

                                <p className="text-muted-foreground mb-6">
                                    We're sorry, but something unexpected happened. Please try again or go back to the homepage.
                                </p>

                                {import.meta.env.DEV && this.state.error && (
                                    <details className="mb-6 text-left">
                                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                            Error Details (Development)
                                        </summary>
                                        <div className="mt-2 p-3 bg-muted rounded text-xs font-mono overflow-auto max-h-32">
                                            <div className="text-destructive font-semibold">
                                                {this.state.error.message}
                                            </div>
                                            <pre className="mt-2 whitespace-pre-wrap">
                                                {this.state.error.stack}
                                            </pre>
                                        </div>
                                    </details>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={this.handleRetry}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                                    >
                                        Try Again
                                    </button>

                                    <Link
                                        to="/"
                                        className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors text-center"
                                    >
                                        Go Home
                                    </Link>
                                </div>

                                {this.state.errorId && (
                                    <p className="mt-4 text-xs text-muted-foreground">
                                        Error ID: {this.state.errorId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook-based error boundary for functional components
 * Note: This is a conceptual implementation - React doesn't support
 * error boundaries in functional components yet, but this pattern
 * can be used with Suspense and error boundaries
 */
export function withErrorBoundary(Component, fallback) {
    return function WrappedComponent(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}

/**
 * Custom error fallback components
 */
export function NetworkErrorFallback({ onRetry }) {
    return (
        <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-warning/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connection Problem</h3>
            <p className="text-muted-foreground mb-4">
                Unable to connect to our servers. Please check your internet connection.
            </p>
            <button
                onClick={onRetry}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
                Retry Connection
            </button>
        </div>
    );
}

export function ChunkLoadErrorFallback({ onRetry }) {
    return (
        <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-info/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading Error</h3>
            <p className="text-muted-foreground mb-4">
                Failed to load application resources. This might be due to a network issue or an app update.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
                Reload Page
            </button>
        </div>
    );
}

export default ErrorBoundary;