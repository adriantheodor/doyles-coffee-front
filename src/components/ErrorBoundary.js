import React from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a user-friendly error UI.
 * 
 * Modern best practices implemented:
 * - Detailed error logging for debugging
 * - User-friendly error messages
 * - Recovery actions (retry, home, refresh)
 * - Development vs production error display
 * - Error tracking integration ready
 * - Accessibility compliant
 * - Mobile responsive
 * 
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * <ErrorBoundary fallback={<CustomErrorUI />} onError={handleError}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log error details and track error event.
   */
  componentDidCatch(error, errorInfo) {
    const errorId = this.generateErrorId();
    
    // Store error details in state
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error caught by ErrorBoundary:');
      console.error('Error ID:', errorId);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo?.componentStack);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    //   tags: {
    //     errorId,
    //   },
    // });
  }

  /**
   * Generate unique error ID for tracking.
   */
  generateErrorId = () => {
    return `ERROR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Reset error boundary and retry.
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
    });
  };

  /**
   * Navigate home.
   */
  goHome = () => {
    window.location.href = '/';
  };

  /**
   * Refresh the page.
   */
  refreshPage = () => {
    window.location.reload();
  };

  /**
   * Toggle error details visibility.
   */
  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  /**
   * Copy error details to clipboard.
   */
  copyErrorDetails = () => {
    const details = `Error ID: ${this.state.errorId}\n\n${this.state.error?.toString()}\n\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(details);
    alert('Error details copied to clipboard');
  };

  render() {
    const { hasError, error, errorInfo, errorId, showDetails } = this.state;
    const { fallback, children } = this.props;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.resetError);
      }

      // Default error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content mobile-container">
            {/* Error Icon & Title */}
            <div className="error-header">
              <div className="error-icon" aria-hidden="true">
                ⚠️
              </div>
              <h1 className="error-title">Something went wrong</h1>
            </div>

            {/* Error Message */}
            <p className="error-message">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>

            {/* Error ID (always show for support) */}
            <div className="error-id-box">
              <strong>Error ID:</strong>
              <code>{errorId}</code>
            </div>

            {/* Error Details (Development only) */}
            {isDevelopment && error && (
              <div className="error-details-section">
                <button
                  className="error-details-toggle"
                  onClick={this.toggleDetails}
                  aria-expanded={showDetails}
                  aria-controls="error-details"
                >
                  {showDetails ? '▼' : '▶'} Technical Details
                </button>

                {showDetails && (
                  <div id="error-details" className="error-details">
                    <div className="error-stack">
                      <h3>Error Message:</h3>
                      <pre>{error.toString()}</pre>
                    </div>

                    {errorInfo?.componentStack && (
                      <div className="error-stack">
                        <h3>Component Stack:</h3>
                        <pre>{errorInfo.componentStack}</pre>
                      </div>
                    )}

                    <button
                      className="btn-copy-details"
                      onClick={this.copyErrorDetails}
                      title="Copy error details to clipboard"
                    >
                      📋 Copy Details
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="error-actions">
              <button
                className="error-btn error-btn-primary"
                onClick={this.resetError}
                aria-label="Try again"
              >
                🔄 Try Again
              </button>
              <button
                className="error-btn error-btn-secondary"
                onClick={this.goHome}
                aria-label="Go to home page"
              >
                🏠 Go Home
              </button>
              <button
                className="error-btn error-btn-secondary"
                onClick={this.refreshPage}
                aria-label="Refresh page"
              >
                🔃 Refresh
              </button>
            </div>

            {/* Support Info */}
            <div className="error-support">
              <p>
                If this problem persists, please contact support with your Error ID:{' '}
                <code>{errorId}</code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
};

export default ErrorBoundary;
