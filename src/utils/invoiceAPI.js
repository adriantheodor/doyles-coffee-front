import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch all invoices for the current user
 */
export const fetchInvoices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/invoices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch invoices');
  }
};

/**
 * Fetch a specific invoice by ID
 */
export const fetchInvoiceById = async (invoiceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch invoice');
  }
};

/**
 * Download invoice as PDF
 */
export const downloadInvoice = async (invoiceId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/invoices/${invoiceId}/download`,
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to download invoice');
  }
};

/**
 * Mark invoice as sent
 */
export const markInvoiceAsSent = async (invoiceId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/invoices/${invoiceId}/mark-sent`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to mark invoice as sent');
  }
};

/**
 * Create a new invoice
 */
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/invoices`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to create invoice');
  }
};

/**
 * Update an existing invoice
 */
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/invoices/${invoiceId}`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to update invoice');
  }
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/invoices/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to delete invoice');
  }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'full'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format amount as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get status badge element or text
 * @param {boolean} isSent - Whether invoice has been sent
 * @param {string} type - Return type: 'text', 'badge', 'className'
 * @returns {string|object} Status text, className, or badge object
 */
export const getStatusBadge = (isSent, type = 'text') => {
  const status = isSent ? 'Sent' : 'Not Sent';
  const className = isSent ? 'badge-success' : 'badge-warning';

  switch (type) {
    case 'className':
      return className;
    case 'badge':
      return {
        text: status,
        className: className,
        icon: isSent ? '✓' : '✗',
      };
    case 'text':
    default:
      return status;
  }
};

/**
 * Handle file download
 * @param {Blob} blob - File blob to download
 * @param {string} filename - Name of the file to download as
 */
export const handleDownload = (blob, filename = 'download') => {
  if (!blob) {
    console.error('No blob provided for download');
    return;
  }

  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error during file download:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Calculate invoice totals
 * @param {array} items - Invoice line items
 * @returns {object} Object with subtotal, tax, and total
 */
export const calculateTotals = (items = []) => {
  if (!Array.isArray(items)) return { subtotal: 0, tax: 0, total: 0 };

  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + itemTotal;
  }, 0);

  const tax = subtotal * (items[0]?.taxRate || 0);
  const total = subtotal + tax;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Validate invoice data
 * @param {object} invoiceData - Invoice data to validate
 * @returns {object} Validation result { isValid, errors }
 */
export const validateInvoiceData = (invoiceData) => {
  const errors = {};

  if (!invoiceData.invoiceNumber?.trim()) {
    errors.invoiceNumber = 'Invoice number is required';
  }

  if (!invoiceData.customerId?.trim()) {
    errors.customerId = 'Customer is required';
  }

  if (!invoiceData.issueDate) {
    errors.issueDate = 'Issue date is required';
  }

  if (!Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
    errors.items = 'At least one line item is required';
  }

  if (invoiceData.amount && invoiceData.amount < 0) {
    errors.amount = 'Amount cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Format API error for display
 * @param {Error} error - Error object from axios
 * @param {string} fallbackMessage - Message to show if error details unavailable
 * @returns {Error} Formatted error with message
 */
export const handleAPIError = (error, fallbackMessage = 'An error occurred') => {
  let message = fallbackMessage;

  if (error.response) {
    // Server responded with error status
    message = error.response.data?.message || error.response.statusText || fallbackMessage;

    if (error.response.status === 401) {
      message = 'Unauthorized. Please log in again.';
      // Optional: Clear auth and redirect to login
      localStorage.removeItem('token');
    } else if (error.response.status === 403) {
      message = 'You do not have permission to access this resource.';
    } else if (error.response.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.response.status === 500) {
      message = 'Server error. Please try again later.';
    }
  } else if (error.request) {
    // Request made but no response
    message = 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    message = error.message || fallbackMessage;
  }

  const formattedError = new Error(message);
  formattedError.originalError = error;
  return formattedError;
};

/**
 * Handle validation errors
 * @param {object} errors - Validation errors object
 * @returns {array} Array of error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return [];

  return Object.entries(errors).map(([field, message]) => ({
    field,
    message,
  }));
};

/**
 * Create error notification object
 * @param {string} message - Error message
 * @param {string} type - Error type: 'error', 'warning', 'info'
 * @returns {object} Notification object
 */
export const createErrorNotification = (message, type = 'error') => {
  return {
    id: Date.now(),
    message,
    type,
    timestamp: new Date(),
  };
};
