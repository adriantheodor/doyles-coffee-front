import React from 'react';
import { formatDate, formatCurrency } from '../utils/invoiceAPI';
import './CustomerInvoiceDetailsModal.css';

/**
 * CustomerInvoiceDetailsModal Component
 * Displays detailed information about a customer's invoice
 */
const CustomerInvoiceDetailsModal = ({
  invoice,
  onClose,
  onDownload,
  downloadLoading,
  downloadError,
}) => {
  if (!invoice) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">Invoice Details</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Invoice Information Section */}
          <div className="details-section">
            <div className="section-header">
              <h3>Invoice Information</h3>
            </div>

            <div className="details-grid">
              {/* Invoice Number */}
              <div className="detail-item">
                <label className="detail-label">Invoice Number</label>
                <p className="detail-value">{invoice.invoiceNumber || 'N/A'}</p>
              </div>

              {/* Amount */}
              <div className="detail-item">
                <label className="detail-label">Amount</label>
                <p className="detail-value detail-amount">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>

              {/* Created Date */}
              <div className="detail-item">
                <label className="detail-label">Created Date</label>
                <p className="detail-value">
                  {invoice.createdAt ? formatDate(invoice.createdAt, 'long') : 'N/A'}
                </p>
              </div>

              {/* Sent Date */}
              {invoice.sentDate && (
                <div className="detail-item">
                  <label className="detail-label">Sent Date</label>
                  <p className="detail-value">
                    {formatDate(invoice.sentDate, 'long')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* File Information Section */}
          <div className="details-section">
            <div className="section-header">
              <h3>File Information</h3>
            </div>

            <div className="details-grid">
              {/* File Name */}
              <div className="detail-item full-width">
                <label className="detail-label">File Name</label>
                <p className="detail-value file-name">
                  <span className="file-icon">📄</span>
                  {invoice.fileName || 'N/A'}
                </p>
              </div>

              {/* File Size */}
              {invoice.fileSize && (
                <div className="detail-item">
                  <label className="detail-label">File Size</label>
                  <p className="detail-value">
                    {(invoice.fileSize / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {/* File Type */}
              {invoice.fileType && (
                <div className="detail-item">
                  <label className="detail-label">File Type</label>
                  <p className="detail-value">{invoice.fileType.toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {invoice.notes && (
            <div className="details-section">
              <div className="section-header">
                <h3>Notes</h3>
              </div>
              <p className="detail-notes">{invoice.notes}</p>
            </div>
          )}

          {/* Download Error */}
          {downloadError && (
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <p className="alert-message">{downloadError}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={onDownload}
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <>
                <span className="spinner">⏳</span>
                Downloading...
              </>
            ) : (
              <>
                <span className="icon">⬇️</span>
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerInvoiceDetailsModal;
