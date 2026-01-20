import React, { useState, useEffect } from 'react';
import { createInvoice } from '../utils/invoiceAPI';
import { validateInvoiceData } from '../utils/invoiceAPI';
import { handleAPIError } from '../utils/invoiceAPI';
import { ButtonLoader } from '../../components/LoadingSpinner';
import './InvoiceUploadForm.css';

/**
 * InvoiceUploadForm Component
 * Form for admins to upload invoice files and associate with customers
 */
const InvoiceUploadForm = ({ onUploadSuccess, onCancel }) => {
  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    notes: '',
  });

  // File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  // UI State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Constants
  const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

  /**
   * Fetch customers from API on component mount
   */
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : data.customers || []);
      setError('');
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate file selection
   */
  const validateFile = (file) => {
    const errors = [];

    if (!file) {
      errors.push('Please select a file');
      return errors;
    }

    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      errors.push('Invalid file type. Please upload a PDF or image (JPG, PNG)');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size exceeds ${FILE_SIZE_MB}MB limit`);
    }

    // Check file name extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      errors.push('Invalid file extension. Use .pdf, .jpg, or .png');
    }

    return errors;
  };

  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      const errors = validateFile(file);

      if (errors.length > 0) {
        setFileError(errors.join('; '));
        setSelectedFile(null);
        // Reset file input
        e.target.value = '';
      } else {
        setSelectedFile(file);
        setFileError('');
      }
    }
  };

  /**
   * Handle form field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  /**
   * Validate form before submission
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.customerId.trim()) {
      errors.customerId = 'Please select a customer';
    }

    if (!selectedFile) {
      errors.file = 'Please select an invoice file';
    }

    if (!formData.amount) {
      errors.amount = 'Please enter an amount';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }

    if (fileError) {
      errors.file = fileError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Prepare form data with file
      const uploadFormData = new FormData();
      uploadFormData.append('customerId', formData.customerId);
      uploadFormData.append('amount', parseFloat(formData.amount));
      uploadFormData.append('notes', formData.notes.trim());
      uploadFormData.append('file', selectedFile);

      // Upload invoice
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/invoices/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: uploadFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload invoice');
      }

      const result = await response.json();

      // Show success message
      setSuccess('Invoice uploaded successfully!');

      // Clear form
      clearForm();

      // Call callback after brief delay to show success message
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      const userMessage = err.message || 'Failed to upload invoice. Please try again.';
      setError(userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Clear form fields
   */
  const clearForm = () => {
    setFormData({
      customerId: '',
      amount: '',
      notes: '',
    });
    setSelectedFile(null);
    setFileError('');
    setValidationErrors({});
  };

  /**
   * Handle cancel button
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      clearForm();
    }
  };

  /**
   * Get file icon based on type
   */
  const getFileIcon = (file) => {
    if (!file) return null;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return '🖼️';
    if (fileName.endsWith('.png')) return '🖼️';

    return '📎';
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="invoice-upload-form-container">
      <div className="invoice-upload-form">
        <h2 className="form-title">Upload Invoice</h2>

        {/* Error Messages */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">✕</span>
            <div className="alert-content">
              <p className="alert-title">Error</p>
              <p className="alert-message">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <div className="alert-content">
              <p className="alert-title">Success</p>
              <p className="alert-message">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          {/* Customer Dropdown */}
          <div className="form-group">
            <label htmlFor="customerId" className="form-label">
              Customer
              <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                disabled={loading || submitting}
                className={`form-select ${validationErrors.customerId ? 'error' : ''}`}
              >
                <option value="">Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.email ? ` (${customer.email})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {validationErrors.customerId && (
              <p className="form-error">{validationErrors.customerId}</p>
            )}
          </div>

          {/* File Input */}
          <div className="form-group">
            <label htmlFor="invoice-file" className="form-label">
              Invoice File
              <span className="required">*</span>
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="invoice-file"
                accept={ACCEPTED_EXTENSIONS.join(',')}
                onChange={handleFileChange}
                disabled={submitting}
                className="file-input"
              />
              <div
                className={`file-input-display ${
                  selectedFile ? 'has-file' : ''
                } ${validationErrors.file ? 'error' : ''}`}
              >
                {selectedFile ? (
                  <div className="file-display-content">
                    <span className="file-icon">{getFileIcon(selectedFile)}</span>
                    <div className="file-info">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileError('');
                        document.getElementById('invoice-file').value = '';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="file-display-placeholder">
                    <span className="upload-icon">📤</span>
                    <p className="upload-text">
                      Click to select or drag and drop
                    </p>
                    <p className="upload-hint">
                      PDF, JPG, or PNG (max {FILE_SIZE_MB}MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            {fileError && <p className="form-error">{fileError}</p>}
            {validationErrors.file && (
              <p className="form-error">{validationErrors.file}</p>
            )}
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={submitting}
                className={`form-input with-prefix ${
                  validationErrors.amount ? 'error' : ''
                }`}
              />
            </div>
            {validationErrors.amount && (
              <p className="form-error">{validationErrors.amount}</p>
            )}
          </div>

          {/* Notes Textarea */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes or details about this invoice..."
              disabled={submitting}
              className="form-textarea"
              rows={4}
            />
            <p className="form-hint">Max 500 characters</p>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <ButtonLoader isLoading={true} text="Uploading" />
              ) : (
                'Upload Invoice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceUploadForm;
