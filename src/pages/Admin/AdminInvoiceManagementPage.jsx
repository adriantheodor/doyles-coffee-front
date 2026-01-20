import React, { useState, useCallback } from 'react';
import InvoiceUploadForm from './InvoiceUploadForm';
import InvoiceListTable from './InvoiceListTable';
import './AdminInvoiceManagementPage.css';

/**
 * AdminInvoiceManagementPage Component
 * Combines invoice upload form and invoice list table in a single management page
 * Handles page-level state and communication between child components
 */
const AdminInvoiceManagementPage = () => {
  // Page State
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'upload'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle successful upload
   * Refresh the invoice list and show success message
   */
  const handleUploadSuccess = useCallback((newInvoice) => {
    setSuccessMessage('Invoice uploaded successfully!');
    setRefreshTrigger((prev) => prev + 1);
    
    // Switch to list tab to show the new invoice
    setActiveTab('list');
    
    // Clear success message after 4 seconds
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle cancel upload
   */
  const handleCancel = useCallback(() => {
    setActiveTab('list');
  }, []);

  return (
    <div className="invoice-management-page">
      <div className="page-header">
        <h1 className="page-title">Invoice Management</h1>
        <p className="page-subtitle">Upload and manage customer invoices</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-alert">
          <span className="alert-icon">✓</span>
          <p className="alert-message">{successMessage}</p>
          <button
            className="alert-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">📋</span>
          Invoice List
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <span className="tab-icon">📤</span>
          Upload Invoice
        </button>
      </div>

      {/* Page Content Sections */}
      <div className="page-content">
        {/* Invoice List Section */}
        {activeTab === 'list' && (
          <div className="content-section">
            <InvoiceListTable key={`list-${refreshTrigger}`} />
          </div>
        )}

        {/* Invoice Upload Form Section */}
        {activeTab === 'upload' && (
          <div className="content-section">
            <div className="form-container">
              <InvoiceUploadForm
                onUploadSuccess={handleUploadSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoiceManagementPage;
