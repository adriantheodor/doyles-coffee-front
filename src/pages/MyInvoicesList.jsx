import React, { useState, useEffect } from 'react';
import {
  downloadInvoice,
  formatDate,
  formatCurrency,
  handleDownload,
} from '../../utils/invoiceAPI';
import { PageLoader } from '../../components/LoadingSpinner';
import CustomerInvoiceDetailsModal from './CustomerInvoiceDetailsModal';
import './MyInvoicesList.css';

/**
 * MyInvoicesList Component
 * Displays the current customer's invoices in a simple read-only table
 */
const MyInvoicesList = () => {
  // Data State
  const [invoices, setInvoices] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Download State
  const [downloadLoading, setDownloadLoading] = useState({});
  const [downloadError, setDownloadError] = useState({});

  // Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  /**
   * Fetch customer's invoices on component mount
   */
  useEffect(() => {
    loadMyInvoices();
  }, []);

  /**
   * Load customer's invoices from API
   */
  const loadMyInvoices = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/invoices/my-invoices/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to load your invoices'
        );
      }

      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : data.invoices || []);
      setError('');
    } catch (err) {
      console.error('Error fetching customer invoices:', err);
      setError(err.message || 'Failed to load invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle view details button - show modal with full invoice details
   */
  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  /**
   * Handle download invoice button
   */
  const handleDownloadInvoice = async (invoice) => {
    setDownloadLoading((prev) => ({ ...prev, [invoice.id]: true }));
    setDownloadError((prev) => ({ ...prev, [invoice.id]: '' }));

    try {
      // Try to download PDF via API
      const blob = await downloadInvoice(invoice.id);
      const filename = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
      handleDownload(blob, filename);

      setSuccess('Invoice downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setDownloadError((prev) => ({
        ...prev,
        [invoice.id]: err.message || 'Failed to download invoice',
      }));
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [invoice.id]: false }));
    }
  };

  return (
    <div className="my-invoices-list-container">
      <div className="invoices-header">
        <h1 className="invoices-title">My Invoices</h1>
        <p className="invoices-subtitle">
          View and download your invoices
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">✕</span>
          <div className="alert-content">
            <p className="alert-message">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <div className="alert-content">
            <p className="alert-message">{success}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <PageLoader isLoading={true} message="Loading your invoices..." />
      ) : invoices.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <p className="empty-icon">📋</p>
          <p className="empty-title">No invoices yet</p>
          <p className="empty-text">
            You don't have any invoices at this time. Check back later.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th className="th-file">File Name</th>
                <th className="th-amount">Amount</th>
                <th className="th-date">Sent Date</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="table-row">
                  {/* File Name - Clickable */}
                  <td className="cell-file">
                    <button
                      className="file-link"
                      onClick={() => handleViewDetails(invoice)}
                      title="View invoice details"
                    >
                      <span className="file-icon">📄</span>
                      {invoice.fileName || 'Invoice'}
                    </button>
                  </td>

                  {/* Amount */}
                  <td className="cell-amount">
                    {formatCurrency(invoice.amount)}
                  </td>

                  {/* Sent Date */}
                  <td className="cell-date">
                    {invoice.sentDate
                      ? formatDate(invoice.sentDate, 'short')
                      : '—'}
                  </td>

                  {/* Download Button */}
                  <td className="cell-actions">
                    <div className="action-group">
                      <button
                        className={`btn-download ${
                          downloadLoading[invoice.id] ? 'loading' : ''
                        }`}
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={downloadLoading[invoice.id]}
                        title="Download invoice"
                      >
                        {downloadLoading[invoice.id] ? (
                          <>
                            <span className="spinner">⏳</span>
                            <span className="btn-text">Downloading</span>
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">⬇️</span>
                            <span className="btn-text">Download</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Download Error */}
                    {downloadError[invoice.id] && (
                      <p className="error-message">
                        {downloadError[invoice.id]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="table-footer">
            <p className="results-count">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <CustomerInvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setShowDetailsModal(false)}
          onDownload={() => handleDownloadInvoice(selectedInvoice)}
          downloadLoading={downloadLoading[selectedInvoice.id]}
          downloadError={downloadError[selectedInvoice.id]}
        />
      )}
    </div>
  );
};

export default MyInvoicesList;
