import React from 'react';
import './ErrorBoundary.css';

/**
 * LocalError Component
 * 
 * Lightweight error UI for component-level errors
 * (e.g., within a card or section, not full page)
 * 
 * Does NOT reset page, only shows error state
 * Useful for individual features that fail
 * 
 * @example
 * <LocalErrorBoundary>
 *   <FeatureComponent />
 * </LocalErrorBoundary>
 */
class LocalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LocalErrorBoundary caught:', error, errorInfo);
    this.setState({ error });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="local-error-container" role="alert">
          <div className="local-error-icon">⚠️</div>
          <h3 className="local-error-title">Something went wrong</h3>
          <p className="local-error-text">
            {this.state.error?.message || 'Failed to load this component'}
          </p>
          <button
            className="local-error-btn"
            onClick={this.resetError}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * AsyncError Component
 * 
 * Catches and displays errors from async operations
 * Used in components that fetch data
 * 
 * @example
 * const AsyncErrorUI = ({ error, onRetry }) => (
 *   <AsyncErrorBoundary onRetry={onRetry}>
 *     <DataComponent />
 *   </AsyncErrorBoundary>
 * );
 */
class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isLoading: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AsyncErrorBoundary caught:', error, errorInfo);
    this.setState({ error, isLoading: false });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retryOperation = async () => {
    this.setState({ isLoading: true });

    try {
      if (this.props.onRetry) {
        await this.props.onRetry();
      }
      this.setState({ hasError: false, error: null, isLoading: false });
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="async-error-container" role="alert">
          <div className="async-error-header">
            <div className="async-error-icon">🔄</div>
            <h3 className="async-error-title">Failed to Load Data</h3>
          </div>
          <p className="async-error-message">
            {this.state.error?.message || 'Could not fetch the requested information. Please try again.'}
          </p>
          <button
            className="async-error-btn"
            onClick={this.retryOperation}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? '⏳ Retrying...' : '🔄 Retry'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Form Error Boundary
 * 
 * Catches validation and submission errors in forms
 * Displays user-friendly messages
 * 
 * @example
 * <FormErrorBoundary>
 *   <MyForm />
 * </FormErrorBoundary>
 */
class FormErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      fieldErrors: {},
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FormErrorBoundary caught:', error, errorInfo);
    
    // Extract field-level errors if available
    const fieldErrors = this.extractFieldErrors(error);
    
    this.setState({ 
      error, 
      fieldErrors,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo, fieldErrors);
    }
  }

  extractFieldErrors = (error) => {
    // Try to extract field-specific errors from validation error
    if (error.name === 'ValidationError' && error.errors) {
      return error.errors;
    }
    return {};
  };

  resetError = () => {
    this.setState({ hasError: false, error: null, fieldErrors: {} });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="form-error-container" role="alert">
          <div className="form-error-header">
            <div className="form-error-icon">📋</div>
            <h3 className="form-error-title">Form Error</h3>
          </div>
          <p className="form-error-message">
            {this.state.error?.message || 'There was an error processing your form. Please check your input and try again.'}
          </p>
          
          {Object.keys(this.state.fieldErrors).length > 0 && (
            <ul className="form-error-list">
              {Object.entries(this.state.fieldErrors).map(([field, errors]) => (
                <li key={field}>
                  <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                </li>
              ))}
            </ul>
          )}

          <button
            className="form-error-btn"
            onClick={this.resetError}
          >
            OK
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { LocalErrorBoundary, AsyncErrorBoundary, FormErrorBoundary };
export default LocalErrorBoundary;
