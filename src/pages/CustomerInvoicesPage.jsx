import React from 'react';
import MyInvoicesList from './MyInvoicesList';
import './CustomerInvoicesPage.css';

/**
 * CustomerInvoicesPage Component
 * Simple page wrapper for displaying customer's invoices
 */
const CustomerInvoicesPage = () => {
  return (
    <div className="customer-invoices-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">My Invoices</h1>
          <p className="page-subtitle">
            View and download your invoices
          </p>
        </div>

        {/* Invoices List Section */}
        <div className="invoices-section">
          <MyInvoicesList />
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoicesPage;
