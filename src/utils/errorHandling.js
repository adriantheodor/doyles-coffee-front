/**
 * Error Handling Utilities
 * Centralized error handling for the application
 */

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, status, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.originalError = originalError;
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Error types
 */
export const ERROR_TYPES = {
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Classify error and determine severity
 * @param {Error} error - Error object
 * @returns {object} Error classification with type and severity
 */
export const classifyError = (error) => {
  if (error.response?.status === 401) {
    return {
      type: ERROR_TYPES.AUTHENTICATION,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: 'Your session has expired. Please log in again.',
    };
  }

  if (error.response?.status === 403) {
    return {
      type: ERROR_TYPES.AUTHORIZATION,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: 'You do not have permission to perform this action.',
    };
  }

  if (error.response?.status === 404) {
    return {
      type: ERROR_TYPES.NOT_FOUND,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: 'The requested resource was not found.',
    };
  }

  if (error.response?.status === 500) {
    return {
      type: ERROR_TYPES.SERVER,
      severity: ERROR_SEVERITY.CRITICAL,
      userMessage: 'Server error. Please try again later.',
    };
  }

  if (error.response?.status >= 400 && error.response?.status < 500) {
    return {
      type: ERROR_TYPES.API,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: error.response?.data?.message || 'Request failed. Please check your input.',
    };
  }

  if (error.response?.status >= 500) {
    return {
      type: ERROR_TYPES.SERVER,
      severity: ERROR_SEVERITY.CRITICAL,
      userMessage: 'Server error. Please try again later.',
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      type: ERROR_TYPES.TIMEOUT,
      severity: ERROR_SEVERITY.MEDIUM,
      userMessage: 'Request timed out. Please try again.',
    };
  }

  if (!error.response && error.request) {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      userMessage: 'Network error. Please check your connection.',
    };
  }

  if (error instanceof ValidationError) {
    return {
      type: ERROR_TYPES.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      userMessage: error.message,
      errors: error.errors,
    };
  }

  return {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    userMessage: 'An unexpected error occurred. Please try again.',
  };
};

/**
 * Log error to console with formatting
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorInfo = classifyError(error);

  console.error(
    `[${timestamp}] ${errorInfo.type} ${context ? `in ${context}` : ''}`,
    {
      message: error.message,
      severity: errorInfo.severity,
      userMessage: errorInfo.userMessage,
      originalError: error,
    }
  );
};

/**
 * Create error report for analytics/monitoring
 * @param {Error} error - Error object
 * @param {object} context - Additional context
 * @returns {object} Error report
 */
export const createErrorReport = (error, context = {}) => {
  const errorInfo = classifyError(error);

  return {
    timestamp: new Date().toISOString(),
    type: errorInfo.type,
    severity: errorInfo.severity,
    message: error.message,
    userMessage: errorInfo.userMessage,
    stackTrace: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
};

/**
 * Create user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getUserFriendlyErrorMessage = (error) => {
  const errorInfo = classifyError(error);
  return errorInfo.userMessage;
};

/**
 * Retry logic for failed operations
 * @param {function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise} Result of operation
 */
export const retryOperation = async (operation, maxRetries = 3, delayMs = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry for client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
};

/**
 * Error boundary helper for React components
 * @param {Error} error - Error from component
 * @param {string} context - Component context
 * @returns {object} Formatted error for boundary
 */
export const handleComponentError = (error, context = '') => {
  logError(error, `Component: ${context}`);

  return {
    hasError: true,
    errorInfo: classifyError(error),
    reportError: createErrorReport(error, { componentContext: context }),
  };
};

/**
 * Global error handler setup
 * Call this once in your app initialization
 */
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Unhandled Promise Rejection');
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(event.error, 'Global Error Handler');
  });
};

/**
 * Transform axios error to app error
 * @param {Error} error - Axios error
 * @returns {Error} Transformed error with user message
 */
export const transformAxiosError = (error) => {
  const errorInfo = classifyError(error);
  const appError = new APIError(
    errorInfo.userMessage,
    error.response?.status || 0,
    error
  );

  return appError;
};
