import React from 'react';
import './ConfirmDeleteModal.css';

/**
 * ConfirmDeleteModal Component
 * Confirmation dialog for deleting an invoice
 */
const ConfirmDeleteModal = ({ invoice, onConfirm, onCancel }) => {
  if (!invoice) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop" onClick={onCancel}></div>

      {/* Modal Content */}
      <div className="modal modal-sm modal-danger">
        <div className="modal-header">
          <h2 className="modal-title">Confirm Delete</h2>
          <button
            className="modal-close-btn"
            onClick={onCancel}
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Warning Icon */}
          <div className="delete-warning">
            <span className="warning-icon">⚠️</span>
          </div>

          {/* Message */}
          <h3 className="delete-title">Delete Invoice?</h3>
          <p className="delete-message">
            Are you sure you want to delete this invoice? This action cannot be undone.
          </p>

          {/* Invoice Info */}
          <div className="delete-invoice-info">
            <div className="info-row">
              <span className="info-label">Invoice Number:</span>
              <span className="info-value">
                {invoice.invoiceNumber || 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Customer:</span>
              <span className="info-value">
                {invoice.customerName || 'Unknown'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">File:</span>
              <span className="info-value">
                {invoice.fileName || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Delete Invoice
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
