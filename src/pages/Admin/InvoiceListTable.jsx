import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchInvoices,
  downloadInvoice,
  formatDate,
  formatCurrency,
  handleDownload,
} from '../../utils/invoiceAPI';
import { PageLoader } from '../../components/LoadingSpinner';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './InvoiceListTable.css';

/**
 * InvoiceListTable Component
 * Displays a table of all invoices with actions
 */
const InvoiceListTable = () => {
  // Data State
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Action States
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, sent, not-sent
  const [sortBy, setSortBy] = useState('date'); // date, customer, amount
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  /**
   * Apply filters and sorting to invoices
   */
  const applyFiltersAndSort = useCallback(() => {
    let results = [...invoices];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (invoice) =>
          invoice.customerName?.toLowerCase().includes(query) ||
          invoice.invoiceNumber?.toLowerCase().includes(query) ||
          invoice.fileName?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter === 'sent') {
      results = results.filter((invoice) => invoice.isSent);
    } else if (statusFilter === 'not-sent') {
      results = results.filter((invoice) => !invoice.isSent);
    }

    // Apply sorting
    results.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'customer':
          compareA = a.customerName?.toLowerCase() || '';
          compareB = b.customerName?.toLowerCase() || '';
          break;
        case 'amount':
          compareA = a.amount || 0;
          compareB = b.amount || 0;
          break;
        case 'date':
        default:
          compareA = new Date(a.createdAt || 0).getTime();
          compareB = new Date(b.createdAt || 0).getTime();
      }

      if (compareA < compareB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredInvoices(results);
  }, [invoices, searchQuery, statusFilter, sortBy, sortOrder]);

  /**
   * Fetch invoices on component mount
   */
  useEffect(() => {
    loadInvoices();
  }, []);

  /**
   * Apply filters and sorting whenever data changes
   */
  useEffect(() => {
    applyFiltersAndSort();
  }, [invoices, searchQuery, statusFilter, sortBy, sortOrder, applyFiltersAndSort]);

  /**
   * Load invoices from API
   */
  const loadInvoices = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchInvoices();
      setInvoices(Array.isArray(data) ? data : data.invoices || []);
      setError('');
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Failed to load invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle view details button
   */
  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  /**
   * Handle send invoice button
   */
  const handleSendInvoice = async (invoiceId) => {
    setActionLoading((prev) => ({ ...prev, [invoiceId]: true }));
    setActionError((prev) => ({ ...prev, [invoiceId]: '' }));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/invoices/${invoiceId}/send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invoice');
      }

      // Update invoice in list
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? { ...inv, isSent: true, sentDate: new Date().toISOString() }
            : inv
        )
      );

      setSuccess('Invoice sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error sending invoice:', err);
      setActionError((prev) => ({
        ...prev,
        [invoiceId]: err.message || 'Failed to send invoice',
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  /**
   * Handle download invoice button
   */
  const handleDownloadInvoice = async (invoice) => {
    setActionLoading((prev) => ({ ...prev, [`dl-${invoice.id}`]: true }));
    setActionError((prev) => ({ ...prev, [`dl-${invoice.id}`]: '' }));

    try {
      // Try to download PDF first
      const blob = await downloadInvoice(invoice.id);
      const filename = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
      handleDownload(blob, filename);

      setSuccess('Invoice downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setActionError((prev) => ({
        ...prev,
        [`dl-${invoice.id}`]: err.message || 'Failed to download invoice',
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [`dl-${invoice.id}`]: false }));
    }
  };

  /**
   * Handle delete button - show confirmation
   */
  const handleDeleteClick = (invoice) => {
    setDeleteTarget(invoice);
    setShowDeleteModal(true);
  };

  /**
   * Confirm and execute delete
   */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setActionLoading((prev) => ({ ...prev, [`del-${deleteTarget.id}`]: true }));
    setActionError((prev) => ({ ...prev, [`del-${deleteTarget.id}`]: '' }));
    setShowDeleteModal(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/invoices/${deleteTarget.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete invoice');
      }

      // Remove from list
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteTarget.id));
      setSuccess(`Invoice "${deleteTarget.invoiceNumber}" deleted successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setActionError((prev) => ({
        ...prev,
        [`del-${deleteTarget.id}`]: err.message || 'Failed to delete invoice',
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [`del-${deleteTarget.id}`]: false }));
      setDeleteTarget(null);
    }
  };

  /**
   * Handle cancel delete
   */
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  /**
   * Handle sort column click
   */
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  /**
   * Get sort indicator for column header
   */
  const getSortIndicator = (column) => {
    if (sortBy !== column) return '';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="invoice-list-table-container">
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

      {/* Controls */}
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer, invoice #, or file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="not-sent">Not Sent</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="customer">Sort by Customer</option>
            <option value="amount">Sort by Amount</option>
          </select>

          <button
            className="btn-refresh"
            onClick={loadInvoices}
            title="Refresh invoices"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <PageLoader isLoading={true} message="Loading invoices..." />
      ) : filteredInvoices.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <p className="empty-icon">📋</p>
          <p className="empty-title">
            {searchQuery || statusFilter !== 'all'
              ? 'No invoices found'
              : 'No invoices yet'}
          </p>
          <p className="empty-text">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first invoice to get started'}
          </p>
        </div>
      ) : (
        /* Table */
        <div className="table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('customer')}>
                  Customer{getSortIndicator('customer')}
                </th>
                <th>Email</th>
                <th>Order #</th>
                <th>File Name</th>
                <th className="sortable" onClick={() => handleSort('amount')}>
                  Amount{getSortIndicator('amount')}
                </th>
                <th>Status</th>
                <th>Sent Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="table-row">
                  {/* Customer Name */}
                  <td className="cell-customer">
                    <button
                      className="customer-link"
                      onClick={() => handleViewDetails(invoice)}
                      title="View invoice details"
                    >
                      {invoice.customerName || 'Unknown'}
                    </button>
                  </td>

                  {/* Email */}
                  <td className="cell-email">
                    {invoice.customerEmail ? (
                      <a href={`mailto:${invoice.customerEmail}`} title={invoice.customerEmail}>
                        {invoice.customerEmail}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>

                  {/* Order Number */}
                  <td className="cell-order">
                    {invoice.orderNumber || 'N/A'}
                  </td>

                  {/* File Name */}
                  <td className="cell-file">
                    <span className="file-badge">
                      <span className="file-icon">📄</span>
                      {invoice.fileName || 'N/A'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="cell-amount">
                    {formatCurrency(invoice.amount)}
                  </td>

                  {/* Status */}
                  <td className="cell-status">
                    <span
                      className={`status-badge ${
                        invoice.isSent ? 'sent' : 'not-sent'
                      }`}
                    >
                      {invoice.isSent ? '✓ Sent' : '✗ Not Sent'}
                    </span>
                  </td>

                  {/* Sent Date */}
                  <td className="cell-date">
                    {invoice.isSent && invoice.sentDate
                      ? formatDate(invoice.sentDate, 'short')
                      : '—'}
                  </td>

                  {/* Actions */}
                  <td className="cell-actions">
                    <div className="action-buttons">
                      {/* View Details */}
                      <button
                        className="btn-action btn-view"
                        onClick={() => handleViewDetails(invoice)}
                        title="View details"
                      >
                        👁️
                      </button>

                      {/* Send Now (only if not sent) */}
                      {!invoice.isSent && (
                        <button
                          className="btn-action btn-send"
                          onClick={() => handleSendInvoice(invoice.id)}
                          disabled={actionLoading[invoice.id]}
                          title="Send invoice"
                        >
                          {actionLoading[invoice.id] ? (
                            <span className="action-spinner">⏳</span>
                          ) : (
                            '📤'
                          )}
                        </button>
                      )}

                      {/* Download */}
                      <button
                        className="btn-action btn-download"
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={actionLoading[`dl-${invoice.id}`]}
                        title="Download invoice"
                      >
                        {actionLoading[`dl-${invoice.id}`] ? (
                          <span className="action-spinner">⏳</span>
                        ) : (
                          '⬇️'
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteClick(invoice)}
                        disabled={actionLoading[`del-${invoice.id}`]}
                        title="Delete invoice"
                      >
                        {actionLoading[`del-${invoice.id}`] ? (
                          <span className="action-spinner">⏳</span>
                        ) : (
                          '🗑️'
                        )}
                      </button>
                    </div>

                    {/* Action Error */}
                    {(actionError[invoice.id] ||
                      actionError[`dl-${invoice.id}`] ||
                      actionError[`del-${invoice.id}`]) && (
                      <p className="action-error">
                        {actionError[invoice.id] ||
                          actionError[`dl-${invoice.id}`] ||
                          actionError[`del-${invoice.id}`]}
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
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <ConfirmDeleteModal
          invoice={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default InvoiceListTable;
