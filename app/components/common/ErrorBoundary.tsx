"use client";
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      // Default error UI
      return (
        <div className="flex justify-center items-center py-12">
          <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-[#006d7d]">Something went wrong</h3>
            </div>
            <p className="text-sm text-[#007e90]/80 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.retry}
              className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component for specific error types
export const SectionErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="flex justify-center items-center py-8">
    <div className="bg-[#007e90]/10 border border-[#007e90]/20 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-3">
        <svg className="w-5 h-5 text-[#007e90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-sm font-medium text-[#006d7d]">Unable to load section</h3>
      </div>
      <p className="text-sm text-[#007e90]/80 mb-4">{error.message}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorBoundary; 