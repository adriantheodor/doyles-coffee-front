import React, { useState } from 'react';
import { formatDate, formatCurrency, downloadInvoice, handleDownload } from '../../utils/invoiceAPI';
import './InvoiceDetailsModal.css';

/**
 * InvoiceDetailsModal Component
 * Displays detailed information about an invoice
 * Includes copyable invoice ID and admin details
 */
const InvoiceDetailsModal = ({ invoice, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  if (!invoice) return null;

  /**
   * Copy invoice ID to clipboard
   */
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(invoice.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Handle file download
   */
  const handleDownloadFile = async () => {
    setDownloading(true);
    setDownloadError('');

    try {
      const blob = await downloadInvoice(invoice.id);
      const filename = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
      handleDownload(blob, filename);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(err.message || 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

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
          {/* Invoice ID Section - Copyable */}
          <div className="invoice-id-section">
            <label className="detail-label">Invoice ID</label>
            <div className="invoice-id-container">
              <code className="invoice-id">{invoice.id || 'N/A'}</code>
              <button
                className="copy-btn"
                onClick={handleCopyId}
                title="Copy invoice ID"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* Download Error */}
          {downloadError && (
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <p className="alert-message">{downloadError}</p>
            </div>
          )}

          {/* Header Section */}
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

              {/* Status */}
              <div className="detail-item">
                <label className="detail-label">Status</label>
                <p className="detail-value">
                  <span
                    className={`status-badge ${
                      invoice.isSent ? 'sent' : 'not-sent'
                    }`}
                  >
                    {invoice.isSent ? '✓ Sent' : '✗ Not Sent'}
                  </span>
                </p>
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
              {invoice.isSent && invoice.sentDate && (
                <div className="detail-item">
                  <label className="detail-label">Sent Date</label>
                  <p className="detail-value">
                    {formatDate(invoice.sentDate, 'long')}
                  </p>
                </div>
              )}

              {/* Sent By (Admin Name) */}
              {invoice.isSent && invoice.sentBy && (
                <div className="detail-item">
                  <label className="detail-label">Sent By</label>
                  <p className="detail-value">{invoice.sentBy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Section */}
          <div className="details-section">
            <div className="section-header">
              <h3>Customer Information</h3>
            </div>

            <div className="details-grid">
              {/* Customer Name */}
              <div className="detail-item">
                <label className="detail-label">Customer Name</label>
                <p className="detail-value">{invoice.customerName || 'N/A'}</p>
              </div>

              {/* Customer Email */}
              {invoice.customerEmail && (
                <div className="detail-item">
                  <label className="detail-label">Email</label>
                  <p className="detail-value">
                    <a href={`mailto:${invoice.customerEmail}`}>
                      {invoice.customerEmail}
                    </a>
                  </p>
                </div>
              )}

              {/* Customer ID */}
              {invoice.customerId && (
                <div className="detail-item">
                  <label className="detail-label">Customer ID</label>
                  <p className="detail-value">{invoice.customerId}</p>
                </div>
              )}
            </div>
          </div>

          {/* File Section */}
          <div className="details-section">
            <div className="section-header">
              <h3>File Information</h3>
              {invoice.fileName && (
                <button
                  className="btn-download-file"
                  onClick={handleDownloadFile}
                  disabled={downloading}
                  title="Download invoice file"
                >
                  {downloading ? '⏳ Downloading...' : '⬇️ Download'}
                </button>
              )}
            </div>

            <div className="details-grid">
              {/* File Name - Clickable for Download */}
              <div className="detail-item full-width">
                <label className="detail-label">File Name</label>
                <p className="detail-value file-name">
                  <button
                    className="file-download-link"
                    onClick={handleDownloadFile}
                    disabled={downloading}
                    title="Download invoice file"
                  >
                    <span className="file-icon">📄</span>
                    {invoice.fileName || 'N/A'}
                  </button>
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

          {/* Additional Details */}
          <div className="details-section">
            <div className="section-header">
              <h3>Additional Information</h3>
            </div>

            <div className="details-grid">
              {/* Upload Date */}
              <div className="detail-item">
                <label className="detail-label">Upload Date</label>
                <p className="detail-value">
                  {invoice.createdAt ? formatDate(invoice.createdAt, 'full') : 'N/A'}
                </p>
              </div>

              {/* Last Modified */}
              {invoice.updatedAt && (
                <div className="detail-item">
                  <label className="detail-label">Last Modified</label>
                  <p className="detail-value">
                    {formatDate(invoice.updatedAt, 'full')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailsModal;
